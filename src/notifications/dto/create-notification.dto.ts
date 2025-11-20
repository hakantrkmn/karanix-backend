import { IsString, IsNotEmpty, IsIn, IsOptional } from 'class-validator';
export class CreateNotificationDto {
  @IsString()
  @IsNotEmpty()
  message: string;

  @IsString()
  @IsNotEmpty()
  @IsIn(['info', 'warning', 'critical'])
  type: 'info' | 'warning' | 'critical';

  @IsString()
  @IsOptional()
  related_id?: string;
}
