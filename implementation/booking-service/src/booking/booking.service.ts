import { EntityManager } from '@mikro-orm/core';
import { Injectable } from '@nestjs/common';
import Ajv from 'ajv';
import addFormats from 'ajv-formats';
import { validate } from 'class-validator';
import { BookingAddressDto } from 'src/booking-address/booking-address.dto';
import { BookingAddress } from 'src/booking-address/booking-address.entity';
import { InventoryDto } from 'src/inventory/inventory.dto';
import { Inventory } from 'src/inventory/inventory.entity';
import { ItemDto } from 'src/item/item.dto';
import { Item } from 'src/item/item.entity';
import {
  InvalidFormDataError,
  ItemAfterBookDeadlineError,
  ItemAlreadyBookedError,
  ItemFullyBookedError,
  NoItemFoundForBookingError,
} from 'src/util/errors';
import { BookingDto } from './booking.dto';
import { Booking } from './booking.entity';

const ajv = new Ajv();
addFormats(ajv);

@Injectable()
export class BookingService {
  constructor(private readonly em: EntityManager) {}

  async bookItem(
    bookingDto: BookingDto,
    itemId: string,
    inventoryBookingAddress: string,
    bookingHolderBookingAddress: string,
  ): Promise<Booking | null> {
    const item = await this.em.findOne(
      Item,
      {
        id: itemId,
        inventory: { bookingAddress: { address: inventoryBookingAddress } },
      },
      { populate: ['inventory.form'] },
    );
    if (!item) throw new NoItemFoundForBookingError();
    if (item.capacity) {
      const bookingCount = await this.em.count(Booking, {
        item: { id: itemId },
      });
      if (bookingCount >= item.capacity) throw new ItemFullyBookedError();
    }
    if (item.bookDeadline && bookingDto.createdAt > item.bookDeadline)
      throw new ItemAfterBookDeadlineError();
    const bookingHolderBookingAddressEntity = await this.em.findOne(
      BookingAddress,
      { address: bookingHolderBookingAddress },
    );
    if (
      item.inventory.form &&
      !ajv.compile(item.inventory.form)(bookingDto.formData ?? {})
    ) {
      throw new InvalidFormDataError();
    }
    if (
      await this.em.findOne(Item, {
        id: itemId,
        bookings: { bookingAddress: { address: bookingHolderBookingAddress } },
      })
    ) {
      throw new ItemAlreadyBookedError();
    }
    const booking = this.em.create(Booking, bookingDto);
    item.bookings.add(booking);
    if (bookingHolderBookingAddressEntity) {
      booking.bookingAddress = bookingHolderBookingAddressEntity;
    } else {
      const bookingHolderBookingAddressDto = new BookingAddressDto();
      bookingHolderBookingAddressDto.address = bookingHolderBookingAddress;
      booking.bookingAddress = this.em.create(
        BookingAddress,
        bookingHolderBookingAddressDto,
      );
    }
    await this.em.persist(booking).flush();
    return booking;
  }

  async findBookingsByUserId(userId: string) {
    return this.em.find(
      Booking,
      { bookingAddress: { userId } },
      { populate: ['item', 'item.inventory.bookingAddress.address'] },
    );
  }

  async remoteBookingHandle(
    booking: {
      id: string;
      createdAt?: string;
      formData?: object;
      item: {
        id: string;
        capacity?: number;
        bookDeadline?: string;
        meta?: object;
      };
    },
    inventoryId?: string,
    bookingAddress?: string,
  ) {
    if (await this.em.findOne(BookingAddress, { address: bookingAddress })) {
      const bookingAddressDto = new BookingAddressDto();
      bookingAddressDto.address = bookingAddress;
      if (!(await validate(bookingAddressDto, { skipMissingProperties: true })))
        throw new Error('Invalid remote booking data');
      const bookingAddressEntity = this.em.create(
        BookingAddress,
        bookingAddressDto,
      );
      this.em.persist(bookingAddressEntity);
    }
    if (!(await this.em.findOne(Inventory, { id: inventoryId }))) {
      const inventoryDto = new InventoryDto();
      inventoryDto.id = inventoryId;
      if (!(await validate(inventoryDto, { skipMissingProperties: true })))
        throw new Error('Invalid remote booking data');
      const inventory = this.em.create(Inventory, inventoryDto);
      inventory.bookingAddress.address = bookingAddress;
      this.em.persist(inventory);
    }
    if (!(await this.em.findOne(Item, { id: booking.item.id }))) {
      const itemDto = new ItemDto();
      itemDto.id = booking.item.id;
      itemDto.bookDeadline = booking.item.bookDeadline;
      itemDto.capacity = booking.item.capacity;
      itemDto.metadata = booking.item.meta;
      if (!(await validate(itemDto, { skipMissingProperties: true })))
        throw new Error('Invalid remote booking data');
      const item = this.em.create(Item, itemDto);
      item.inventory.id = inventoryId;
      this.em.persist(item);
    }
    if (!(await this.em.findOne(Booking, { id: booking.id }))) {
      const bookingDto = new BookingDto();
      bookingDto.id = booking.id;
      bookingDto.formData = booking.formData;
      bookingDto.createdAt = booking.createdAt
        ? new Date(booking.createdAt)
        : new Date();
      if (!(await validate(bookingDto, { skipMissingProperties: true })))
        throw new Error('Invalid remote booking data');
      const bookingEntity = this.em.create(Booking, bookingDto);
      bookingEntity.item.id = booking.item.id;
      this.em.persist(bookingEntity);
    }
    await this.em.flush();
  }
}
