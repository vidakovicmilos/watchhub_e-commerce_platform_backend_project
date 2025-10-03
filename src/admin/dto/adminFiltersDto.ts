import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional } from 'class-validator';

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

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  page?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  limit?: number;
}
