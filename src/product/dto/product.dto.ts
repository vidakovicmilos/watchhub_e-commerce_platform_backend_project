import { ApiProperty } from '@nestjs/swagger';
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
  @ApiProperty({ example: 'Product Name' })
  name: string;

  @IsEnum(Gender, {
    message: `Gender must be one of the following values: ${enumValues}`,
  })
  @IsNotEmpty()
  @ApiProperty({ example: Gender.FEMALE, enum: Gender })
  gender: Gender;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'This is description' })
  description: string;

  @Type(() => Number)
  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({ example: 169.67 })
  price: number;

  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  @Min(0)
  @Max(100)
  @ApiProperty({ example: 15, required: false })
  discount?: number;

  @Type(() => Number)
  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({ example: 1 })
  brandId: number;
}
