import {
  Collection,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryKey,
  Property,
  Rel,
  Unique,
} from '@mikro-orm/core';
import { Booking } from '../booking/booking.entity';
import { Inventory } from '../inventory/inventory.entity';

@Entity()
export class BookingAddress {
  @PrimaryKey({ columnType: 'citext' })
  address!: string;

  @Property({ type: 'uuid', nullable: true })
  @Unique()
  userId?: string;

  @OneToOne({ entity: () => Inventory, nullable: true })
  inventory?: Rel<Inventory>;

  @OneToMany({
    entity: () => Booking,
    mappedBy: (booking) => booking.bookingAddress,
  })
  bookings = new Collection<Booking>(this);
}
