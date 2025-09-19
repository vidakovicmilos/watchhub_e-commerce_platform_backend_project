import { IsNotEmpty, IsString } from 'class-validator';

export class BrandDto {
  @IsString()
  @IsNotEmpty()
  name: string;
}
