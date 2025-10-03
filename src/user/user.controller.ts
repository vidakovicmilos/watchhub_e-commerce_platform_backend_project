import {
  Body,
  Controller,
  Delete,
  Get,
  Injectable,
  Param,
  ParseIntPipe,
  Patch,
  Query,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { JwtAuthGuard } from 'src/auth/guard';
import { GetUser } from 'src/auth/decorator';
import type { User } from '@prisma/client';
import { EditUserDto, UserFiltersDto } from './dto';
import { RolesGuard } from 'src/guards';
import { Roles } from 'src/decorators';

@Injectable()
@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  // **************** me ***************************

  @UseGuards(JwtAuthGuard)
  @Get('me')
  getMe(@GetUser() user: User) {
    return user;
  }

  @UseGuards(JwtAuthGuard)
  @Patch('me')
  editMe(@GetUser('id') userId: number, @Body() dto: EditUserDto) {
    return this.userService.editUser(userId, dto);
  }

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

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Delete(':id')
  deleteUserById(@Param('id', ParseIntPipe) userId: number) {
    return this.userService.deleteUser(userId);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Patch(':id')
  editUser(
    @Param('id', ParseIntPipe) userId: number,
    @Body() dto: EditUserDto,
  ) {
    return this.userService.editUser(userId, dto);
  }
}
