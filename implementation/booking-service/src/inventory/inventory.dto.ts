import { IsObject, IsOptional, IsString, IsUUID } from 'class-validator';
import { Inventory } from './inventory.entity';

export class InventoryDto {
  @IsOptional()
  @IsUUID(4)
  id: Inventory['id'];

  @IsOptional()
  @IsObject()
  metadata?: Inventory['metadata'];

  @IsOptional()
  @IsObject()
  form?: Inventory['form'];

  @IsOptional()
  @IsString()
  itemType?: Inventory['itemType'];

  @IsOptional()
  @IsObject()
  itemMetadataSchema?: Inventory['itemMetadataSchema'];
}
