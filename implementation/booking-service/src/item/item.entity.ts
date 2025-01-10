import {
  Collection,
  Entity,
  Formula,
  Index,
  ManyToOne,
  OneToMany,
  PrimaryKey,
  Property,
  Rel,
} from '@mikro-orm/core';
import { v4 } from 'uuid';
import { Booking } from '../booking/booking.entity';
import { Inventory } from '../inventory/inventory.entity';

@Entity()
export class Item {
  @PrimaryKey({ type: 'uuid' })
  id = v4();

  @Property()
  @Index()
  createdAt!: Date;

  @Property({ nullable: true })
  capacity?: number;

  @Property({ nullable: true })
  bookDeadline?: Date;

  @Property({ type: 'jsonb', nullable: true })
  metadata?: object;

  @Formula(
    (alias) => `(select count(*) from booking b where b.item_id = ${alias}.id)`,
  )
  occupancy: number;

  @ManyToOne({ entity: () => Inventory })
  inventory!: Rel<Inventory>;

  @OneToMany({ entity: () => Booking, mappedBy: (booking) => booking.item })
  bookings = new Collection<Booking>(this);
}
