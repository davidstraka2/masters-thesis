import { EntityManager } from '@mikro-orm/core';
import { Injectable } from '@nestjs/common';
import { BookingAddress } from 'src/booking-address/booking-address.entity';
import { Item } from 'src/item/item.entity';

@Injectable()
export class ItemService {
  constructor(private readonly em: EntityManager) {}

  async findItemWithBookings(itemId: string, userId: BookingAddress['userId']) {
    return this.em.findOne(
      Item,
      { id: itemId, inventory: { bookingAddress: { userId } } },
      { populate: ['bookings', 'bookings.bookingAddress.address'] },
    );
  }
}
