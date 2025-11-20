import { IsOptional, IsEnum, IsDateString } from 'class-validator';
import { OperationStatus } from '../types/operation.types';

export class FindAllQueryDto {
  @IsDateString()
  @IsOptional()
  date?: string;

  @IsEnum(OperationStatus)
  @IsOptional()
  status?: OperationStatus;
}
