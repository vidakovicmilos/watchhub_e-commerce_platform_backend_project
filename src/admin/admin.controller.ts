import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from 'src/auth/guard';
import { RolesGuard } from 'src/guards';
import { Roles } from 'src/decorators';
import { AdminFiltersDto, SetRoleDto } from './dto';

@Controller('admins')
export class AdminController {
  constructor(private adminService: AdminService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SUPERADMIN', 'ADMIN')
  @Get()
  getAllAdmins(@Query() filters: AdminFiltersDto) {
    return this.adminService.getAllAdmins(filters);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SUPERADMIN')
  @Patch('setRole/:id')
  setRoleById(
    @Param('id', ParseIntPipe) userId: number,
    @Body() dto: SetRoleDto,
  ) {
    return this.adminService.setRoleById(userId, dto);
  }
}
