import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import * as argon from 'argon2';
import {
  EditUserDto,
  ForgetPasswordDto,
  ResetPasswordDto,
  UserFiltersDto,
} from './dto';
import { MailService } from 'src/mail/mail.service';
import { ChangePasswordDto } from './dto/changePasswod.dto';

@Injectable()
export class UserService {
  constructor(
    private prisma: PrismaService,
    private mailService: MailService,
  ) {}

  async forgetPassword(dto: ForgetPasswordDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (!user) {
      throw new NotFoundException(`User with email '${dto.email}' not found.`);
    }

    await this.prisma.resetCode.deleteMany({ where: { userId: user.id } });

    const restPasswordMail = await this.mailService.sendRestPasswordMail(
      dto.email,
    );

    await this.prisma.resetCode.create({
      data: {
        code: restPasswordMail.code,
        userId: user.id,
        expiresAt: restPasswordMail.expiresAt,
      },
    });

    return { message: 'Reset password email sent' };
  }

  async resetPassword(dto: ResetPasswordDto) {
    const resetRecord = await this.prisma.resetCode.findFirst({
      where: {
        code: dto.code,
        user: { email: dto.email },
        expiresAt: { gt: new Date() },
      },
    });

    if (!resetRecord) {
      throw new BadRequestException('Invalid or expired reset code');
    }

    const newPassword = await argon.hash(dto.newPassword);

    await this.prisma.user.update({
      where: { id: resetRecord.userId },
      data: { password: newPassword },
    });

    await this.prisma.resetCode.delete({ where: { id: resetRecord.id } });

    return { message: 'Password successfully reset' };
  }

  async changePassword(userId: number, dto: ChangePasswordDto) {
    let user = await this.prisma.user.findUnique({ where: { id: userId } });
    const pwMatches = await argon.verify(user!.password, dto.oldPassword);
    if (!pwMatches) {
      throw new BadRequestException('Old password is incorrect');
    }

    if (dto.oldPassword === dto.newPassword) {
      throw new BadRequestException(
        'New password cannot be the same as old password',
      );
    }

    const newPassword = await argon.hash(dto.newPassword);

    user = await this.prisma.user.update({
      where: { id: user!.id },
      data: { password: newPassword },
    });

    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async getAllUsers(filters: UserFiltersDto) {
    const limit = filters.limit || 20;
    const skipProducts = filters.page ? (filters.page - 1) * limit : 0;
    const users = await this.prisma.user.findMany({
      skip: skipProducts,
      take: limit,
      orderBy: {
        [filters.sort as any]: filters.order,
      },
    });

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
