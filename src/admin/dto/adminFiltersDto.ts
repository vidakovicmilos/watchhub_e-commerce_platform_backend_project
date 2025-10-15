import { Transform, Type } from 'class-transformer';
import { IsEnum, IsIn, IsInt, IsOptional, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

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
  @ApiPropertyOptional({ description: 'Filter by role', enum: Roles })
  role?: Roles;

  @Type(() => Number)
  @IsOptional()
  @IsInt()
  @ApiPropertyOptional({ description: 'Page number for pagination' })
  page?: number;

  @Type(() => Number)
  @IsOptional()
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
