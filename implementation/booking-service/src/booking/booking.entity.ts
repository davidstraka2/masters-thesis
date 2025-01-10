import {
  Entity,
  Index,
  ManyToOne,
  PrimaryKey,
  Property,
  Rel,
} from '@mikro-orm/core';
import { v4 } from 'uuid';
import { BookingAddress } from '../booking-address/booking-address.entity';
import { Item } from '../item/item.entity';

@Entity()
export class Booking {
  @PrimaryKey({ type: 'uuid' })
  id = v4();

  @Property()
  @Index()
  createdAt!: Date;

  @Property({ type: 'jsonb', nullable: true })
  formData?: object;

  @ManyToOne({ entity: () => BookingAddress })
  bookingAddress!: Rel<BookingAddress>;

  @ManyToOne({ entity: () => Item })
  item!: Rel<Item>;
}
