import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Query,
  UseGuards,
} from '@nestjs/common';
import { PurchaseService } from './purchase.service';
import { JwtAuthGuard } from 'src/auth/guard';

import { RolesGuard } from 'src/guards';
import { Roles } from 'src/decorators';
import {
  ChangePurchaseStatus,
  PurchaseAdminFiltersDto,
  PurchaseCustomerFiltersDto,
  PurchaseSellerFiltersDto,
} from './dto';
import { GetUser } from 'src/auth/decorator';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('purchases')
export class PurchaseController {
  constructor(private purchaseService: PurchaseService) {}

  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SUPERADMIN', 'ADMIN')
  @Get()
  getAllPurchases(@Query() filters: PurchaseAdminFiltersDto) {
    return this.purchaseService.getAllPurchases(filters);
  }

  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard)
  @Get('my')
  getPurchasesAsCustomer(
    @GetUser('id') userId: number,
    @Query() filters: PurchaseCustomerFiltersDto,
  ) {
    return this.purchaseService.getPurchasesAsCustomer(userId, filters);
  }

  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard)
  @Get('my-sales')
  getPurchasesAsSeller(
    @GetUser('id') userId: number,
    @Query() filters: PurchaseSellerFiltersDto,
  ) {
    return this.purchaseService.getPurchasesAsSeller(userId, filters);
  }

  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard)
  @Get('my/:purchaseId')
  getPurchaseByIdAsCustomer(
    @Param('purchaseId', ParseIntPipe) purchaseId: number,
    @GetUser('id') userId: number,
  ) {
    return this.purchaseService.getPurchaseByIdAsCustomer(purchaseId, userId);
  }

  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard)
  @Get('my-sales/:purchaseId')
  getPurchaseByIdAsSeller(
    @Param('purchaseId', ParseIntPipe) purchaseId: number,
    @GetUser('id') userId: number,
  ) {
    return this.purchaseService.getPurchaseByIdAsSeller(purchaseId, userId);
  }

  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard)
  @Patch('my-sales/:purchaseId')
  changePurchaseStatusAsSeller(
    @Param('purchaseId', ParseIntPipe) purchaseId: number,
    @GetUser('id') userId: number,
    @Body() dto: ChangePurchaseStatus,
  ) {
    return this.purchaseService.changePurchaseStatusByIdAsSeller(
      purchaseId,
      userId,
      dto,
    );
  }

  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SUPERADMIN', 'ADMIN')
  @Get(':purchaseId')
  getPurchaseById(@Param('purchaseId', ParseIntPipe) purchaseId: number) {
    return this.purchaseService.getPurchaseById(purchaseId);
  }

  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SUPERADMIN', 'ADMIN')
  @Patch(':purchaseId')
  changePurchaseStatusById(
    @Param('purchaseId', ParseIntPipe) purchaseId: number,
    @Body() dto: ChangePurchaseStatus,
  ) {
    return this.purchaseService.changePurchaseStatusById(purchaseId, dto);
  }

  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SUPERADMIN', 'ADMIN')
  @Delete(':purchaseId')
  deletePurchaseById(@Param('purchaseId', ParseIntPipe) purchaseId: number) {
    return this.purchaseService.deletePurchaseById(purchaseId);
  }
}
