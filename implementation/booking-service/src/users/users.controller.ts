import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  Get,
  Headers,
  InternalServerErrorException,
  Logger,
  NotFoundException,
  Param,
  Post,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { isIP, validate } from 'class-validator';
import { Response } from 'express';
import { reverse } from 'node:dns/promises';
import { BookingAddressDto } from 'src/booking-address/booking-address.dto';
import {
  normalizeBookingAddress,
  parseBookingAddress,
} from 'src/booking-address/booking-address.util';
import { BookingDto } from 'src/booking/booking.dto';
import { BookingService } from 'src/booking/booking.service';
import { InventoryService } from 'src/inventory/inventory.service';
import {
  getBookingServiceInfo,
  validateBookingServiceCompatibility,
} from 'src/util/booking-service-info';
import {
  InvalidFormDataError,
  ItemAfterBookDeadlineError,
  ItemAlreadyBookedError,
  ItemFullyBookedError,
  NoItemFoundForBookingError,
} from 'src/util/errors';

@Controller('users')
export class UsersController {
  private readonly logger = new Logger(UsersController.name);

  constructor(
    private readonly bookingService: BookingService,
    private readonly inventoryService: InventoryService,
    private readonly configService: ConfigService,
  ) {}

  @Get(':username')
  async getInventory(
    @Param('username') username: string | undefined,
    @Headers('booking-address') bookingAddress: string | undefined,
    @Headers('booking-service-info') bookingServiceInfo: string | undefined,
    @Headers('fwd-host') forwardedHost: string | undefined,
    @Headers('fwd-remote-ip') forwardedRemoteIP: string | undefined,
    @Res({ passthrough: true }) res: Response,
  ): Promise<{
    id: string;
    meta?: object;
    form?: object;
    itemType?: string;
    itemMetaSchema?: object;
    items?: Array<{
      id: string;
      capacity?: number;
      bookDeadline?: string;
      meta?: object;
      occupancy?: number;
    }>;
  }> {
    this.logger.verbose({
      method: 'GET',
      path: `/users/${username}`,
      forwardedHost,
      bookingAddress,
      bookingServiceInfo,
      forwardedRemoteIP,
    });
    if (typeof bookingAddress !== 'string')
      throw new BadRequestException('No "booking-address" header present');
    if (typeof forwardedHost !== 'string')
      throw new BadRequestException('No "fwd-host" header present');
    if (typeof forwardedRemoteIP !== 'string')
      throw new BadRequestException('No "fwd-remote-ip" header present');
    if (!validateBookingServiceCompatibility(bookingServiceInfo))
      throw new BadRequestException('Incompatible booking service version');
    await validateClientBookingAddress(bookingAddress, forwardedRemoteIP);
    const targetBookingAddress = normalizeBookingAddress(
      `${username}@${forwardedHost}`,
    );
    await validateTargetBookingAddress(targetBookingAddress);
    try {
      const inventory =
        await this.inventoryService.findByBookingAddress(targetBookingAddress);
      if (inventory === null)
        throw new NotFoundException(
          `Booking address ${targetBookingAddress} does not exist or has no inventory`,
        );
      res.setHeader('booking-service-info', getBookingServiceInfo());
      return {
        id: inventory.id,
        meta: inventory.metadata,
        form: inventory.form,
        itemType: inventory.itemType,
        itemMetaSchema: inventory.itemMetadataSchema,
        ...(inventory.items
          ? {
              items: [
                ...inventory.items.map((item) => ({
                  id: item.id,
                  capacity: item.capacity,
                  bookDeadline: item.bookDeadline?.toISOString(),
                  meta: item.metadata,
                  occupancy: parseInt(`${item.occupancy}`, 10),
                })),
              ],
            }
          : {}),
      };
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      this.logger.error(error);
      throw new InternalServerErrorException();
    }
  }

  @Post(':username/bookings')
  async createBooking(
    @Param('username') username: string | undefined,
    @Headers('booking-address') bookingAddress: string | undefined,
    @Headers('booking-service-info') bookingServiceInfo: string | undefined,
    @Headers('fwd-host') forwardedHost: string | undefined,
    @Headers('fwd-remote-ip') forwardedRemoteIP: string | undefined,
    @Body()
    body: {
      formData?: object;
      item: {
        id: string;
      };
    },
    @Res({ passthrough: true }) res: Response,
  ): Promise<{
    id: string;
    createdAt?: string;
    formData?: object;
    item: {
      id: string;
      capacity?: number;
      bookDeadline?: string;
      meta?: object;
    };
  }> {
    this.logger.verbose({
      method: 'GET',
      path: `/users/${username}/`,
      forwardedHost,
      bookingAddress,
      bookingServiceInfo,
      forwardedRemoteIP,
      body,
    });
    if (typeof bookingAddress !== 'string')
      throw new BadRequestException('No "booking-address" header present');
    if (typeof forwardedHost !== 'string')
      throw new BadRequestException('No "fwd-host" header present');
    if (typeof forwardedRemoteIP !== 'string')
      throw new BadRequestException('No "fwd-remote-ip" header present');
    if (!validateBookingServiceCompatibility(bookingServiceInfo))
      throw new BadRequestException('Incompatible booking service version');
    if (typeof body?.item?.id !== 'string')
      throw new BadRequestException('Invalid or no item id in body');
    if (body?.formData && typeof body.formData !== 'object')
      throw new BadRequestException('Invalid formData in body');
    await validateClientBookingAddress(bookingAddress, forwardedRemoteIP);
    const targetBookingAddress = normalizeBookingAddress(
      `${username}@${forwardedHost}`,
    );
    await validateTargetBookingAddress(targetBookingAddress);
    const bookingDto = new BookingDto();
    bookingDto.createdAt = new Date();
    bookingDto.formData = body.formData;
    try {
      const booking = await this.bookingService.bookItem(
        bookingDto,
        body.item.id,
        targetBookingAddress,
        bookingAddress,
      );
      res.setHeader('booking-service-info', getBookingServiceInfo());
      return {
        id: booking.id,
        createdAt: booking.createdAt.toISOString(),
        formData: booking.formData,
        item: {
          id: booking.item.id,
          capacity: booking.item.capacity,
          bookDeadline: booking.item.bookDeadline?.toISOString(),
          meta: booking.item.metadata,
        },
      };
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      if (error instanceof NoItemFoundForBookingError)
        throw new NotFoundException(error.message);
      if (error instanceof ItemAlreadyBookedError)
        throw new ConflictException(error.message);
      if (
        error instanceof ItemAfterBookDeadlineError ||
        error instanceof ItemFullyBookedError ||
        error instanceof InvalidFormDataError
      ) {
        throw new BadRequestException(error.message);
      }
      this.logger.error(error);
      throw new InternalServerErrorException();
    }
  }
}

async function validateClientBookingAddress(
  address: string,
  forwardedRemoteIP: string,
): Promise<void> {
  const bookingAddressDto = new BookingAddressDto();
  bookingAddressDto.address = address;
  const bookingAddressValidationErrors = await validate(bookingAddressDto, {
    skipMissingProperties: true,
  });
  if (bookingAddressValidationErrors.length > 0)
    throw new BadRequestException(bookingAddressValidationErrors);
  const { hostname } = parseBookingAddress(normalizeBookingAddress(address));
  if (hostname !== 'localhost' && !isIP(hostname)) {
    const dnsHostnames = await reverse(forwardedRemoteIP);
    if (!dnsHostnames.includes(hostname))
      throw new UnauthorizedException('Booking address remote IP mismatch');
  }
}

async function validateTargetBookingAddress(address: string): Promise<void> {
  const bookingAddressDto = new BookingAddressDto();
  bookingAddressDto.address = address;
  const bookingAddressValidationErrors = await validate(bookingAddressDto, {
    skipMissingProperties: true,
  });
  if (bookingAddressValidationErrors.length > 0)
    throw new BadRequestException(bookingAddressValidationErrors);
}
