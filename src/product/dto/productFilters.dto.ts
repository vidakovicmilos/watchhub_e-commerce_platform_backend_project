import { ApiPropertyOptional } from '@nestjs/swagger';
import { Gender } from '@prisma/client';
import { Transform, Type } from 'class-transformer';
import {
  IsEnum,
  IsIn,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';

const genderValues = Object.values(Gender).join(', ');

export class ProductFilterDto {
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  @ApiPropertyOptional({ description: 'Minimum price' })
  minPrice?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  @ApiPropertyOptional({ description: 'Maximum price' })
  maxPrice?: number;

  @IsOptional()
  @IsEnum(Gender, {
    message: `Gender must be one of the following values: ${genderValues}`,
  })
  @ApiPropertyOptional({ description: 'Gender filter' })
  gender?: Gender;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  @Max(100)
  @ApiPropertyOptional({ description: 'Minimum discount percentage' })
  minDiscount?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  @Max(100)
  @ApiPropertyOptional({ description: 'Maximum discount percentage' })
  maxDiscount?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @ApiPropertyOptional({ description: 'Brand ID filter' })
  brandId?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @ApiPropertyOptional({ description: 'Page number for pagination' })
  page?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @ApiPropertyOptional({ description: 'Number of items per page' })
  limit?: number;

  @IsOptional()
  @IsString()
  @IsIn(['finalPrice', 'createdAt', 'updatedAt'])
  @Transform(({ value }) => value ?? 'finalPrice')
  @ApiPropertyOptional({
    description: 'Sort field: finalPrice, createdAt, or updatedAt',
  })
  sort?: string;

  @IsOptional()
  @IsString()
  @Transform(({ value }) => value ?? 'asc')
  @ApiPropertyOptional({
    description: 'Sort order: asc or desc',
    enum: ['asc', 'desc'],
  })
  order?: 'asc' | 'desc' = 'asc';
}
