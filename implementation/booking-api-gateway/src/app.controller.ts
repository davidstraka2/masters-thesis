import {
  Body,
  Controller,
  ForbiddenException,
  Headers,
  HttpException,
  InternalServerErrorException,
  Logger,
  Post,
  Req,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';

@Controller('forward-booking-request')
export class AppController {
  private readonly logger = new Logger(AppController.name);

  constructor(private readonly configService: ConfigService) {}

  @Post()
  async getRequest(
    @Headers('booking-address') bookingAddress: string | undefined,
    @Headers('booking-service-info') bookingServiceInfo: string | undefined,
    @Headers('fwd-url') forwardUrl: string | undefined,
    @Headers('fwd-method') forwardMethod: string | undefined,
    @Req() req: Request,
    @Body() body?: object,
  ): Promise<any> {
    this.logger.verbose({
      method: 'POST',
      path: `/forward-booking-request`,
      bookingAddress,
      forwardUrl,
      forwardMethod,
      body,
    });
    const bookingServiceIP = this.configService.get('bookingServiceIP');
    if (req.socket.remoteAddress !== bookingServiceIP)
      throw new ForbiddenException();
    const shouldIncludeBody = Object.keys(body ?? {}).length > 0;
    let resFromRemote: Awaited<ReturnType<typeof fetch>>;
    try {
      resFromRemote = await fetch(decodeURIComponent(forwardUrl), {
        method: forwardMethod,
        headers: {
          'booking-address': bookingAddress,
          'booking-service-info': bookingServiceInfo,
          ...(shouldIncludeBody ? { 'content-type': 'application/json' } : {}),
        },
        ...(shouldIncludeBody ? { body: JSON.stringify(body) } : {}),
      });
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException();
    }
    if (resFromRemote.status >= 400)
      throw new HttpException(await resFromRemote.json(), resFromRemote.status);
    return resFromRemote.json();
  }
}
