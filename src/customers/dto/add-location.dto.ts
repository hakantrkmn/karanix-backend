import { IsString, IsNotEmpty, IsMongoId } from 'class-validator';

export class AddLocationToCustomerDto {
  @IsString()
  @IsNotEmpty()
  @IsMongoId()
  id: string;

  @IsString()
  @IsNotEmpty()
  @IsMongoId()
  locationId: string;
}
