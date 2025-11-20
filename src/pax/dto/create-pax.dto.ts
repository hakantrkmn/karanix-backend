import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsEnum,
  ValidateNested,
  IsMongoId,
} from 'class-validator';
import { Type } from 'class-transformer';
import { PaxStatus } from '../types/pax.types';

class PickupPointDto {
  @IsNotEmpty()
  lat: number;

  @IsNotEmpty()
  lng: number;

  @IsString()
  @IsOptional()
  address?: string;
}

export class CreatePaxDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  phone?: string;

  @ValidateNested()
  @Type(() => PickupPointDto)
  @IsOptional()
  pickup_point?: PickupPointDto;

  @IsString()
  @IsMongoId()
  @IsOptional()
  operation_id?: string;

  @IsEnum(PaxStatus)
  @IsOptional()
  status?: PaxStatus;

  @IsString()
  @IsOptional()
  seat_no?: string;

  @IsString()
  @IsOptional()
  reservation_id?: string;

  @IsString()
  @IsOptional()
  notes?: string;
}
