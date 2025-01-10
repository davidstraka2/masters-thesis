import {
  BadRequestException,
  Controller,
  Get,
  Headers,
  HttpException,
  InternalServerErrorException,
  Logger,
  Param,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { validate } from 'class-validator';
import { BookingAddressDto } from 'src/booking-address/booking-address.dto';
import { BookingAddressService } from 'src/booking-address/booking-address.service';
import {
  normalizeBookingAddress,
  parseBookingAddress,
  validateBookingAddress,
} from 'src/booking-address/booking-address.util';
import { getBookingServiceInfo } from 'src/util/booking-service-info';
import { NoBookingAddressFoundError } from 'src/util/errors';

@Controller('api/booking-addresses/:address/inventory')
export class AddressInventoryController {
  private readonly logger = new Logger(AddressInventoryController.name);

  constructor(
    private readonly bookingAddressService: BookingAddressService,
    private readonly configService: ConfigService,
  ) {}

  @Get()
  async getInventory(
    @Param('address') targetBookingAddress: string,
    @Headers('user-id') userId: string | undefined,
  ): Promise<object> {
    this.logger.verbose({
      method: 'GET',
      path: `/api/booking-addresses/${targetBookingAddress}/inventory`,
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
    await validateBookingAddress(targetBookingAddress);
    const parsedTargetBookingAddress = parseBookingAddress(
      normalizeBookingAddress(targetBookingAddress),
    );
    parsedTargetBookingAddress.port ??= '3080';
    const forwardProtocol =
      parsedTargetBookingAddress.hostname === 'localhost' ? 'http' : 'https';
    const forwardUrl = `${forwardProtocol}://${parsedTargetBookingAddress.hostname}:${
      parsedTargetBookingAddress.port
    }/users/${parsedTargetBookingAddress.username}`;
    let res: Awaited<ReturnType<typeof fetch>>;
    try {
      const userBookingAddress =
        await this.bookingAddressService.findByUserId(userId);
      const apiGatewayForwardUrl = `http://${this.configService.get(
        'apiGateway.hostname',
      )}:${this.configService.get('apiGateway.port')}/forward-booking-request`;
      res = await fetch(apiGatewayForwardUrl, {
        method: 'POST',
        headers: {
          'booking-address': userBookingAddress.address,
          'booking-service-info': getBookingServiceInfo(),
          'fwd-url': forwardUrl,
          'fwd-method': 'GET',
        },
      });
    } catch (error) {
      if (error instanceof NoBookingAddressFoundError)
        throw new BadRequestException('Given "user-id" has no booking address');
      this.logger.error(error);
      throw new InternalServerErrorException();
    }
    if (res.status >= 400)
      throw new HttpException(await res.json(), res.status);
    return res.json();
  }
}
