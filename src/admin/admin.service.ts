import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { SetRoleDto } from './dto/setRole.dto';

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  async getAllAdmins() {
    const admins = await this.prisma.user.findMany({
      where: { role: { in: ['ADMIN', 'SUPERADMIN'] } },
    });

    if (admins.length === 0) return { message: 'No admins found', admins: [] };

    return admins;
  }

  async setRoleById(userId: number, dto: SetRoleDto) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });

    if (!user) throw new NotFoundException(`User with ID ${userId} not found`);
    if (user.role == dto.role)
      return { message: `User is already ${dto.role}`, user };

    const userWithNewRole = await this.prisma.user.update({
      where: { id: userId },
      data: { role: dto.role },
    });

    const { password, ...userWithoutPassword } = userWithNewRole;
    return userWithoutPassword;
  }
}
