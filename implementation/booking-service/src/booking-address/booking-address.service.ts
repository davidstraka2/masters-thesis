import {
  EntityManager,
  UniqueConstraintViolationException,
} from '@mikro-orm/core';
import { Injectable } from '@nestjs/common';
import {
  BookingAddressConflictError,
  OneBookingAddressPerUserError,
} from 'src/util/errors';
import { BookingAddressDto } from './booking-address.dto';
import { BookingAddress } from './booking-address.entity';
import { normalizeBookingAddress } from './booking-address.util';

@Injectable()
export class BookingAddressService {
  constructor(private readonly em: EntityManager) {}

  async create(
    bookingAddressDto: BookingAddressDto,
  ): Promise<BookingAddress | null> {
    try {
      bookingAddressDto.address = normalizeBookingAddress(
        bookingAddressDto.address,
      );
      const bookingAddress = this.em.create(BookingAddress, bookingAddressDto);
      await this.em.persist(bookingAddress).flush();
      return bookingAddress;
    } catch (err) {
      if (
        err instanceof UniqueConstraintViolationException &&
        err['constraint'] === 'booking_address_pkey'
      ) {
        throw new BookingAddressConflictError();
      } else if (
        err instanceof UniqueConstraintViolationException &&
        err['constraint'] === 'booking_address_user_id_unique'
      ) {
        throw new OneBookingAddressPerUserError();
      } else {
        throw err;
      }
    }
  }

  async findByAddress(
    address: BookingAddress['address'],
  ): Promise<BookingAddress | null> {
    return this.em.findOne(BookingAddress, { address });
  }

  async findByUserId(
    userId: BookingAddress['userId'],
  ): Promise<BookingAddress | null> {
    return this.em.findOne(BookingAddress, { userId });
  }
}
