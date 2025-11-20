import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsEnum,
  ValidateNested,
  IsNumber,
} from 'class-validator';
import { Type } from 'class-transformer';
import { CheckInMethod } from '../types/pax.types';

class GpsDto {
  @IsNumber()
  @IsNotEmpty()
  lat: number;

  @IsNumber()
  @IsNotEmpty()
  lng: number;
}

export class CheckInDto {
  @IsEnum(CheckInMethod)
  @IsNotEmpty()
  method: CheckInMethod;

  @ValidateNested()
  @Type(() => GpsDto)
  @IsOptional()
  gps?: GpsDto;

  @IsString()
  @IsOptional()
  photoUrl?: string;

  @IsString()
  @IsNotEmpty()
  eventId: string;
}
