import { IsString, IsNotEmpty, IsMongoId } from 'class-validator';

export class StartOperationDto {
  @IsString()
  @IsNotEmpty()
  @IsMongoId()
  id: string;
}
