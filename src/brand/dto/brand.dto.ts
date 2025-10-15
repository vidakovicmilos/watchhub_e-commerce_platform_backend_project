import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class BrandDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'Guess' })
  name: string;
}
