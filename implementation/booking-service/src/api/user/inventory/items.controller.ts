import {
  BadRequestException,
  Body,
  Controller,
  Headers,
  InternalServerErrorException,
  Logger,
  Post,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { validate } from 'class-validator';
import { BookingAddressDto } from 'src/booking-address/booking-address.dto';
import { InventoryService } from 'src/inventory/inventory.service';
import { ItemDto } from 'src/item/item.dto';

@Controller('api/user/inventory/items')
export class ItemsController {
  private readonly logger = new Logger(ItemsController.name);

  constructor(
    private readonly inventoryService: InventoryService,
    private readonly configService: ConfigService,
  ) {}

  @Post()
  async createItem(
    @Headers('user-id') userId: string | undefined,
    @Body()
    data?: {
      name: string;
      capacity?: number;
      bookDeadline?: string;
      metadata?: object;
    },
  ): Promise<void> {
    this.logger.verbose({
      method: 'POST',
      path: '/api/user/inventory/items',
      userId,
      body: data,
    });
    if (typeof userId !== 'string')
      throw new BadRequestException('No "user-id" header present');
    const bookingAddress = new BookingAddressDto();
    bookingAddress.userId = userId;
    const bookingAddressValidationErrors = await validate(bookingAddress, {
      skipMissingProperties: true,
    });
    if (bookingAddressValidationErrors.length > 0)
      throw new BadRequestException(bookingAddressValidationErrors);
    const item = new ItemDto();
    item.createdAt = new Date();
    item.capacity = data?.capacity;
    item.bookDeadline = data?.bookDeadline;
    item.metadata = data?.metadata;
    const itemValidationErrors = await validate(item);
    if (itemValidationErrors.length > 0)
      throw new BadRequestException(itemValidationErrors);
    try {
      await this.inventoryService.addItem(item, userId);
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException();
    }
  }
}
