import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { EditUserDto } from './dto';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async getAllUsers() {
    const users = await this.prisma.user.findMany();

    const usersWithoutPassword = users.map(({ password, ...rest }) => rest);
    return usersWithoutPassword;
  }

  async getUserById(userId: number) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });

    if (!user) throw new NotFoundException(`User with id ${userId} not found.`);

    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async editUser(userId: number, dto: EditUserDto) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });

    if (!user) throw new NotFoundException(`User with id ${userId} not found.`);

    const updatedUser = await this.prisma.user.update({
      where: { id: userId },
      data: { ...dto },
    });

    const { password, ...userWithoutPassword } = updatedUser;
    return userWithoutPassword;
  }

  async deleteUser(userId: number) {
    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user) throw new NotFoundException(`User with id ${userId} not found.`);

    await this.prisma.user.delete({
      where: {
        id: userId,
      },
    });

    return { message: `User with id ${userId} was sucessfuly deleted!` };
  }
}
