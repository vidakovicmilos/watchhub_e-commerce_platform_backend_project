import { Transform, Type } from 'class-transformer';
import { IsEnum, IsIn, IsInt, IsOptional, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { PurchaseStatus } from '@prisma/client';

const enumValues = Object.values(PurchaseStatus).join(', ');

export class PurchaseBasicFiltersDto {
  @IsOptional()
  @IsEnum(PurchaseStatus, {
    message: `Status must be one of the following values: ${enumValues}`,
  })
  @ApiPropertyOptional({
    description: 'Filter by purchase status',
    enum: PurchaseStatus,
  })
  status: PurchaseStatus;

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
  @IsIn(['createdAt'])
  @Transform(({ value }) => value ?? 'createdAt')
  @ApiPropertyOptional({ description: 'Sort field', enum: ['createdAt'] })
  sort?: string;

  @IsOptional()
  @IsString()
  @Transform(({ value }) => value ?? 'asc')
  @ApiPropertyOptional({ description: 'Sort order', enum: ['asc', 'desc'] })
  order?: 'asc' | 'desc' = 'asc';
}
