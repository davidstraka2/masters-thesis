import { IsDate, IsObject, IsOptional, IsUUID } from 'class-validator';
import { Booking } from './booking.entity';

export class BookingDto {
  @IsOptional()
  @IsUUID(4)
  id: Booking['id'];

  @IsDate()
  createdAt: Booking['createdAt'];

  @IsOptional()
  @IsObject()
  formData?: Booking['formData'];
}
