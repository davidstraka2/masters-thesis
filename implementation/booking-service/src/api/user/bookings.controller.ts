import {
  BadRequestException,
  Controller,
  Get,
  Headers,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { validate } from 'class-validator';
import { BookingAddressDto } from 'src/booking-address/booking-address.dto';
import { BookingService } from 'src/booking/booking.service';

@Controller('api/user/bookings')
export class BookingsController {
  private readonly logger = new Logger(BookingsController.name);

  constructor(
    private readonly bookingService: BookingService,
    private readonly configService: ConfigService,
  ) {}

  @Get()
  async getBookings(
    @Headers('user-id') userId: string | undefined,
  ): Promise<object[]> {
    this.logger.verbose({
      method: 'POST',
      path: '/api/user/bookings',
      userId,
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
    try {
      const bookings = await this.bookingService.findBookingsByUserId(userId);
      if (!bookings) throw new BadRequestException('Null bookings');
      return bookings;
    } catch (error) {
      if (error instanceof BadRequestException) throw error;
      this.logger.error(error);
      throw new InternalServerErrorException();
    }
  }
}
