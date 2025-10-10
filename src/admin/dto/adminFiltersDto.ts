import { Transform, Type } from 'class-transformer';
import { IsEnum, IsIn, IsInt, IsOptional, IsString } from 'class-validator';

enum Roles {
  ADMIN = 'ADMIN',
  SUPERADMIN = 'SUPERADMIN',
}

const enumValues = Object.values(Roles).join(', ');

export class AdminFiltersDto {
  @IsOptional()
  @IsEnum(Roles, {
    message: `Role must be one of the following values: ${enumValues}`,
  })
  role?: Roles;

  @Type(() => Number)
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  page?: number;

  @Type(() => Number)
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
