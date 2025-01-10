import {
  Collection,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryKey,
  Property,
  Rel,
} from '@mikro-orm/core';
import { v4 } from 'uuid';
import { BookingAddress } from '../booking-address/booking-address.entity';
import { Item } from '../item/item.entity';

@Entity()
export class Inventory {
  @PrimaryKey({ type: 'uuid' })
  id = v4();

  @Property({ type: 'jsonb', nullable: true })
  metadata?: object;

  @Property({ type: 'jsonb', nullable: true })
  form?: object;

  @Property({ type: 'text', nullable: true })
  itemType?: string;

  @Property({ type: 'jsonb', nullable: true })
  itemMetadataSchema?: object;

  @OneToOne({
    entity: () => BookingAddress,
    mappedBy: (bookingAddress) => bookingAddress.inventory,
  })
  bookingAddress!: Rel<BookingAddress>;

  @OneToMany({
    entity: () => Item,
    mappedBy: (item) => item.inventory,
  })
  items = new Collection<Item>(this);
}
