import {
  BadRequestException,
  Controller,
  Get,
  Headers,
  InternalServerErrorException,
  Logger,
  Param,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { validate } from 'class-validator';
import { BookingAddressDto } from 'src/booking-address/booking-address.dto';
import { Item } from 'src/item/item.entity';
import { ItemService } from 'src/item/item.service';

@Controller('api/user/inventory/items/:itemId/bookings')
export class ItemBookingsController {
  private readonly logger = new Logger(ItemBookingsController.name);

  constructor(
    private readonly itemService: ItemService,
    private readonly configService: ConfigService,
  ) {}

  @Get()
  async getItemBookings(
    @Param('itemId') itemId: string,
    @Headers('user-id') userId?: string,
  ): Promise<Item> {
    this.logger.verbose({
      method: 'GET',
      path: `/api/user/inventory/item/${itemId}/`,
      userId,
    });
    if (!userId) throw new BadRequestException('No user-id header present');
    const bookingAddress = new BookingAddressDto();
    bookingAddress.userId = userId;
    const bookingAddressValidationErrors = await validate(bookingAddress, {
      skipMissingProperties: true,
    });
    if (bookingAddressValidationErrors.length > 0)
      throw new BadRequestException(bookingAddressValidationErrors);
    try {
      const item = await this.itemService.findItemWithBookings(itemId, userId);
      if (!item)
        throw new BadRequestException(
          'Given "user-id" has no item with given item id',
        );
      return item;
    } catch (error) {
      if (error instanceof BadRequestException) throw error;
      this.logger.error(error);
      throw new InternalServerErrorException();
    }
  }
}
