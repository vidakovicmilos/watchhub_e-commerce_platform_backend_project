import { IsEnum, IsNotEmpty } from 'class-validator';

enum UserRole {
  USER = 'USER',
  ADMIN = 'ADMIN',
}

export class SetRoleDto {
  @IsEnum(UserRole, { message: 'Role must be USER or ADMIN' })
  @IsNotEmpty()
  role: UserRole;
}
