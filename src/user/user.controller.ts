import {
  Body,
  Controller,
  Delete,
  Get,
  Injectable,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { JwtAuthGuard } from 'src/auth/guard';
import { GetUser } from 'src/auth/decorator';
import type { User } from '@prisma/client';
import {
  EditUserDto,
  ForgetPasswordDto,
  ResetPasswordDto,
  UserFiltersDto,
} from './dto';
import { RolesGuard } from 'src/guards';
import { Roles } from 'src/decorators';
import { ApiBearerAuth } from '@nestjs/swagger';

@Injectable()
@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  // Password *********************************
  @Post('forget-password')
  forgetPassword(@Body() dto: ForgetPasswordDto) {
    return this.userService.forgetPassword(dto);
  }

  @Post('reset-password')
  resetPassword(@Body() dto: ResetPasswordDto) {
    return this.userService.resetPassword(dto);
  }

  // **************** me ***************************
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard)
  @Get('me')
  getMe(@GetUser() user: User) {
    return user;
  }

  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard)
  @Patch('me')
  editMe(@GetUser('id') userId: number, @Body() dto: EditUserDto) {
    return this.userService.editUser(userId, dto);
  }

  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard)
  @Delete('me')
  deleteMe(@GetUser('id') userId: number) {
    return this.userService.deleteUser(userId);
  }

  // ***********************************************
  @Get()
  getAllUsers(@Query() filters: UserFiltersDto) {
    return this.userService.getAllUsers(filters);
  }

  @Get(':id')
  getUserById(@Param('id', ParseIntPipe) userId: number) {
    return this.userService.getUserById(userId);
  }

  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SUPERADMIN', 'ADMIN')
  @Delete(':id')
  deleteUserById(@Param('id', ParseIntPipe) userId: number) {
    return this.userService.deleteUser(userId);
  }

  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SUPERADMIN', 'ADMIN')
  @Patch(':id')
  editUser(
    @Param('id', ParseIntPipe) userId: number,
    @Body() dto: EditUserDto,
  ) {
    return this.userService.editUser(userId, dto);
  }
}
