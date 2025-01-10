import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Headers,
  InternalServerErrorException,
  Logger,
  NotFoundException,
  Post,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { validate } from 'class-validator';
import { BookingAddressDto } from 'src/booking-address/booking-address.dto';
import { InventoryDto } from 'src/inventory/inventory.dto';
import { Inventory } from 'src/inventory/inventory.entity';
import { InventoryService } from 'src/inventory/inventory.service';
import { NoBookingAddressFoundError } from 'src/util/errors';

@Controller('api/user/inventory')
export class InventoryController {
  private readonly logger = new Logger(InventoryController.name);

  constructor(
    private readonly inventoryService: InventoryService,
    private readonly configService: ConfigService,
  ) {}

  @Post()
  async createInventory(
    @Headers('user-id') userId: string | undefined,
    @Body()
    data?: {
      metadata?: object;
      form?: object;
      itemType?: string;
      itemMetadataSchema?: object;
    },
  ): Promise<void> {
    this.logger.verbose({
      method: 'POST',
      path: '/api/user/inventory',
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
    const inventory = new InventoryDto();
    inventory.metadata = data?.metadata;
    inventory.form = data?.form;
    inventory.itemType = data?.itemType;
    inventory.itemMetadataSchema = data?.itemMetadataSchema;
    const inventoryValidationErrors = await validate(inventory);
    if (inventoryValidationErrors.length > 0)
      throw new BadRequestException(inventoryValidationErrors);
    try {
      await this.inventoryService.create(inventory, userId);
    } catch (error) {
      if (error instanceof NoBookingAddressFoundError)
        throw new BadRequestException('Given "user-id" has no booking address');
      this.logger.error(error);
      throw new InternalServerErrorException();
    }
  }

  @Get()
  async getInventory(@Headers('user-id') userId?: string): Promise<Inventory> {
    this.logger.verbose({
      method: 'GET',
      path: '/api/user/inventory',
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
      const inventory = await this.inventoryService.findByUserId(userId);
      if (!inventory)
        throw new NotFoundException('Given "user-id" has no inventory');
      return inventory;
    } catch (error) {
      if (
        error instanceof BadRequestException ||
        error instanceof NotFoundException
      ) {
        throw error;
      }
      this.logger.error(error);
      throw new InternalServerErrorException();
    }
  }
}
