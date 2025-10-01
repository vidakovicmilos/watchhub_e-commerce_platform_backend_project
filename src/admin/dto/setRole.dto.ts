import { Role } from '@prisma/client';
import { IsEnum, IsNotEmpty } from 'class-validator';

export class SetRoleDto {
  @IsEnum(Role, { message: 'Role must be USER, ADMIN or SUPERADMIN' })
  @IsNotEmpty()
  role: Role;
}
