import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  Get,
  Headers,
  InternalServerErrorException,
  Logger,
  Post,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { validate } from 'class-validator';
import { BookingAddressDto } from 'src/booking-address/booking-address.dto';
import { BookingAddress } from 'src/booking-address/booking-address.entity';
import { BookingAddressService } from 'src/booking-address/booking-address.service';
import { isBookingAddressHostedAt } from 'src/booking-address/booking-address.util';
import {
  BookingAddressConflictError,
  OneBookingAddressPerUserError,
} from 'src/util/errors';

@Controller('api/user/booking-address')
export class BookingAddressController {
  private readonly logger = new Logger(BookingAddressController.name);

  constructor(
    private readonly bookingAddressService: BookingAddressService,
    private readonly configService: ConfigService,
  ) {}

  @Get()
  async getAddress(
    @Headers('user-id') userId?: string,
  ): Promise<BookingAddress> {
    this.logger.verbose({
      method: 'GET',
      path: '/api/user/booking-address',
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
      const bookingAddress =
        await this.bookingAddressService.findByUserId(userId);
      if (!bookingAddress)
        throw new BadRequestException('Given "user-id" has no booking address');
      return bookingAddress;
    } catch (error) {
      if (error instanceof BadRequestException) throw error;
      this.logger.error(error);
      throw new InternalServerErrorException();
    }
  }

  @Post()
  async createAddress(
    @Headers('user-id') userId: string | undefined,
    @Body('address') address: string | undefined,
  ): Promise<BookingAddress> {
    this.logger.verbose({
      method: 'POST',
      path: '/api/user/booking-address',
      userId,
      body: { address },
    });
    if (typeof userId !== 'string')
      throw new BadRequestException('No "user-id" header present');
    if (typeof address !== 'string')
      throw new BadRequestException('No "address" JSON field present in body');
    if (
      !isBookingAddressHostedAt(
        this.configService.get('apiGateway.hostname'),
        this.configService.get('apiGateway.port'),
        address,
      )
    ) {
      throw new BadRequestException('Invalid "address" host/port');
    }
    const bookingAddress = new BookingAddressDto();
    bookingAddress.address = address;
    bookingAddress.userId = userId;
    const bookingAddressValidationErrors = await validate(bookingAddress);
    if (bookingAddressValidationErrors.length > 0)
      throw new BadRequestException(bookingAddressValidationErrors);
    try {
      return await this.bookingAddressService.create(bookingAddress);
    } catch (error) {
      if (error instanceof BookingAddressConflictError)
        throw new ConflictException(error.message);
      if (error instanceof OneBookingAddressPerUserError)
        throw new BadRequestException(error.message);
      this.logger.error(error);
      throw new InternalServerErrorException();
    }
  }
}
