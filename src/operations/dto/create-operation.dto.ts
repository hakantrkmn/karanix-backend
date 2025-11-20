import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsEnum,
  IsDateString,
  IsArray,
  IsMongoId,
  IsNumber,
  ValidateNested,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';
import { OperationStatus } from '../types/operation.types';

class RoutePointDto {
  @IsNumber()
  lat: number;

  @IsNumber()
  lng: number;
}

export class CreateOperationDto {
  @IsString()
  @IsNotEmpty()
  code: string;

  @IsString()
  @IsNotEmpty()
  tour_name: string;

  @IsEnum(OperationStatus)
  @IsOptional()
  status?: OperationStatus;

  @IsDateString()
  @IsOptional()
  date?: string;

  @IsString()
  @IsOptional()
  vehicle_id?: string;

  @IsString()
  @IsOptional()
  driver_id?: string;

  @IsString()
  @IsOptional()
  guide_id?: string;

  @IsDateString()
  @IsOptional()
  start_time?: string;

  @IsArray()
  @IsMongoId({ each: true })
  @IsOptional()
  pax?: string[];

  @IsNumber()
  @Min(0)
  @IsOptional()
  checked_in_count?: number;

  @IsNumber()
  @Min(0)
  @IsOptional()
  total_pax?: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => RoutePointDto)
  @IsOptional()
  route?: RoutePointDto[];
}
