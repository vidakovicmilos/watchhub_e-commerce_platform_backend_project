import { Gender } from '@prisma/client';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';

const enumValues = Object.values(Gender).join(', ');

export class ProductDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEnum(Gender, {
    message: `Gender must be one of the following values: ${enumValues}`,
  })
  @IsNotEmpty()
  gender: Gender;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsNumber()
  @IsNotEmpty()
  price: number;

  @IsNumber()
  @IsOptional()
  @Min(0)
  @Max(100)
  discount?: number;

  @IsNumber()
  @IsNotEmpty()
  brandId: number;
}
