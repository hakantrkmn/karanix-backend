import { IsString, IsNotEmpty, IsMongoId } from 'class-validator';

export class MarkAsReadDto {
  @IsString()
  @IsNotEmpty()
  @IsMongoId()
  id: string;
}
