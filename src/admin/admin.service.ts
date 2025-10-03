import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { SetRoleDto } from './dto/setRole.dto';
import { AdminFiltersDto } from './dto';

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  async getAllAdmins(filters: AdminFiltersDto) {
    const limit = filters.limit || 20;
    const skipProducts = filters.page ? (filters.page - 1) * limit : 0;

    if (!filters.role) {
      return await this.prisma.user.findMany({
        skip: skipProducts,
        take: limit,
        where: { role: { in: ['ADMIN', 'SUPERADMIN'] } },
      });
    }

    return await this.prisma.user.findMany({
      skip: skipProducts,
      take: limit,
      where: { role: filters.role },
    });
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
