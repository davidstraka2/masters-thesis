import { MikroORM } from '@mikro-orm/core';
import { MikroOrmMiddleware, MikroOrmModule } from '@mikro-orm/nestjs';
import {
  MiddlewareConsumer,
  Module,
  NestModule,
  OnModuleInit,
} from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AddressBookingsController } from './api/booking-addresses/bookings.controller';
import { AddressInventoryController } from './api/booking-addresses/inventory.controller';
import { BookingAddressController } from './api/user/booking-address.controller';
import { BookingsController } from './api/user/bookings.controller';
import { InventoryController } from './api/user/inventory.controller';
import { ItemsController } from './api/user/inventory/items.controller';
import { ItemBookingsController } from './api/user/inventory/items/item-bookings.controller';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BookingAddressService } from './booking-address/booking-address.service';
import { BookingService } from './booking/booking.service';
import config from './config';
import { InventoryService } from './inventory/inventory.service';
import { ItemService } from './item/item.service';
import { UsersController } from './users/users.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [config],
    }),
    MikroOrmModule.forRoot(),
  ],
  controllers: [
    AppController,
    AddressBookingsController,
    AddressInventoryController,
    BookingAddressController,
    BookingsController,
    InventoryController,
    ItemBookingsController,
    ItemsController,
    UsersController,
  ],
  providers: [
    AppService,
    BookingService,
    BookingAddressService,
    InventoryService,
    ItemService,
  ],
})
export class AppModule implements NestModule, OnModuleInit {
  constructor(private readonly orm: MikroORM) {}

  async onModuleInit(): Promise<void> {
    await this.orm.getMigrator().up();
  }

  configure(consumer: MiddlewareConsumer) {
    consumer.apply(MikroOrmMiddleware).forRoutes('*');
  }
}
