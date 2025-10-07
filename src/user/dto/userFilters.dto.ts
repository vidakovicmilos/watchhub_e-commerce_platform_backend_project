import { Transform, Type } from 'class-transformer';
import { IsOptional, IsInt, IsIn, IsString } from 'class-validator';

export class UserFiltersDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  page?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  limit?: number;

  @IsOptional()
  @IsString()
  @IsIn(['createdAt'])
  @Transform(({ value }) => value ?? 'createdAt')
  sort?: string;

  @IsOptional()
  @IsString()
  @Transform(({ value }) => value ?? 'asc')
  order?: 'asc' | 'desc' = 'asc';
}
