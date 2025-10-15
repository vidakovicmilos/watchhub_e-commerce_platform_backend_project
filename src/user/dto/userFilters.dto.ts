import { Transform, Type } from 'class-transformer';
import { IsOptional, IsInt, IsIn, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UserFiltersDto {
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
