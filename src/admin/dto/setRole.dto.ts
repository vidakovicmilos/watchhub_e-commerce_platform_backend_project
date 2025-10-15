import { ApiProperty } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { IsEnum, IsNotEmpty } from 'class-validator';

const enumValues = Object.values(Role).join(', ');

export class SetRoleDto {
  @IsEnum(Role, { message: `Role must be ${enumValues}` })
  @IsNotEmpty()
  @ApiProperty({ example: Role.ADMIN, enum: Role })
  role: Role;
}
