import { IsUUID } from 'class-validator';
import { BookingAddress } from './booking-address.entity';
import { IsBookingAddress } from './booking-address.util';

export class BookingAddressDto {
  @IsBookingAddress()
  address: BookingAddress['address'];

  @IsUUID(4)
  userId: BookingAddress['userId'];
}
