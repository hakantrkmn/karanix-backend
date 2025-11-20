import { IsString, IsNotEmpty, IsIn } from 'class-validator';

export class RegisterDto {
  @IsString()
  @IsNotEmpty()
  username: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsString()
  @IsNotEmpty()
  @IsIn(['admin', 'guide', 'driver'])
  role: 'admin' | 'guide' | 'driver';
}
