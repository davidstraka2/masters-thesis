import { EntityManager } from '@mikro-orm/core';
import { Injectable } from '@nestjs/common';
import { BookingAddress } from 'src/booking-address/booking-address.entity';
import { ItemDto } from 'src/item/item.dto';
import { Item } from 'src/item/item.entity';
import { NoBookingAddressFoundError } from 'src/util/errors';
import { InventoryDto } from './inventory.dto';
import { Inventory } from './inventory.entity';

@Injectable()
export class InventoryService {
  constructor(private readonly em: EntityManager) {}

  async addItem(itemDto: ItemDto, userId: string): Promise<Item | null> {
    const bookingAddress = await this.em.findOne(
      BookingAddress,
      { userId },
      { populate: ['inventory'] },
    );
    if (!bookingAddress) throw new NoBookingAddressFoundError();
    const item = this.em.create(Item, itemDto);
    bookingAddress.inventory.items.add(item);
    await this.em.persist(item).flush();
    return item;
  }

  async create(
    inventoryDto: InventoryDto,
    userId: string,
  ): Promise<Inventory | null> {
    const bookingAddress = await this.em.findOne(BookingAddress, { userId });
    if (!bookingAddress) throw new NoBookingAddressFoundError();
    const inventory = this.em.create(Inventory, inventoryDto);
    bookingAddress.inventory = inventory;
    await this.em.persist(inventory).flush();
    return inventory;
  }

  async findByBookingAddress(address: string): Promise<Inventory | null> {
    return this.em.findOne(
      Inventory,
      { bookingAddress: { address } },
      { populate: ['items'] },
    );
  }

  async findByUserId(
    userId: BookingAddress['userId'],
  ): Promise<Inventory | null> {
    return this.em.findOne(
      Inventory,
      { bookingAddress: { userId } },
      { populate: ['items'] },
    );
  }
}
