import { Type } from 'class-transformer';
import { IsOptional, IsInt } from 'class-validator';

export class UserFiltersDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  page?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  limit?: number;
}
