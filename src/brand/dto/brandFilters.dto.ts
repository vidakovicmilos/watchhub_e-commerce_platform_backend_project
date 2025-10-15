import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class BrandFiltersDto {
  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ description: 'Filter by brand name' })
  name: string;

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
}
