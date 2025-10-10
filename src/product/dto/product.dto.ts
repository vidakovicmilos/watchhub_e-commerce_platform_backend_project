import { Gender } from '@prisma/client';
import { Type } from 'class-transformer';
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

  @Type(() => Number)
  @IsNumber()
  @IsNotEmpty()
  price: number;

  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  @Min(0)
  @Max(100)
  discount?: number;

  @Type(() => Number)
  @IsNumber()
  @IsNotEmpty()
  brandId: number;
}
