import { IsString, IsNotEmpty, IsMongoId } from 'class-validator';

export class FindOneCustomerDto {
  @IsString()
  @IsNotEmpty()
  @IsMongoId()
  id: string;
}
