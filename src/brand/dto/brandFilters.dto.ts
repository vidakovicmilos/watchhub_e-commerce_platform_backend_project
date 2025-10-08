import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsString } from 'class-validator';

export class BrandFiltersDto {
  @IsOptional()
  @IsString()
  name: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  page?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  limit?: number;
}
