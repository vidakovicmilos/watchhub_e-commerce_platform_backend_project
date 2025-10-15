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

export class EditProductDto {
  @IsString()
  @IsOptional()
  @ApiProperty({ example: 'Test Product', required: false })
  name: string;

  @IsEnum(Gender, {
    message: `Gender must be one of the following values: ${enumValues}`,
  })
  @IsOptional()
  @ApiProperty({ example: Gender.MALE, enum: Gender, required: false })
  gender: Gender;

  @IsString()
  @IsOptional()
  @ApiProperty({ example: 'This is description', required: false })
  description: string;

  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  @ApiProperty({ example: 123, required: false })
  price: number;

  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  @Min(0)
  @Max(100)
  @ApiProperty({ example: 25, required: false })
  discount?: number;

  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  @ApiProperty({ example: 1, required: false })
  brandId: number;
}
