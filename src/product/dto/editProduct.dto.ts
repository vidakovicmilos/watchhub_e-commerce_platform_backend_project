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

export class EditProductDto {
  @IsString()
  @IsOptional()
  name: string;

  @IsEnum(Gender, {
    message: `Gender must be one of the following values: ${enumValues}`,
  })
  @IsOptional()
  gender: Gender;

  @IsString()
  @IsOptional()
  description: string;

  @IsNumber()
  @IsOptional()
  price: number;

  @IsNumber()
  @IsOptional()
  @Min(0)
  @Max(100)
  discount?: number;

  @IsNumber()
  @IsOptional()
  brandId: number;
}
