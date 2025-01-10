import {
  IsDate,
  IsDateString,
  IsInt,
  IsObject,
  IsOptional,
  IsUUID,
  Min,
} from 'class-validator';
import { Item } from './item.entity';

export class ItemDto {
  @IsOptional()
  @IsUUID(4)
  id: Item['id'];

  @IsDate()
  createdAt: Item['createdAt'];

  @IsOptional()
  @IsInt()
  @Min(0)
  capacity?: Item['capacity'];

  @IsOptional()
  @IsDateString()
  bookDeadline?: string;

  @IsOptional()
  @IsObject()
  metadata?: Item['metadata'];
}
