import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { PurchaseService } from './purchase.service';
import { JwtAuthGuard } from 'src/auth/guard';

import { RolesGuard } from 'src/guards';
import { Roles } from 'src/decorators';
import { ChangePurchaseStatus } from './dto';

@Controller('purchases')
export class PurchaseController {
  constructor(private purchaseService: PurchaseService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SUPERADMIN', 'ADMIN')
  @Get()
  getAllPurchases() {
    return this.purchaseService.getAllPurchases();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SUPERADMIN', 'ADMIN')
  @Get(':purchaseId')
  getPurchaseById(@Param('purchaseId', ParseIntPipe) purchaseId: number) {
    return this.purchaseService.getPurchaseById(purchaseId);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SUPERADMIN', 'ADMIN')
  @Patch(':purchaseId')
  changePurchaseStatusById(
    @Param('purchaseId', ParseIntPipe) purchaseId: number,
    @Body() dto: ChangePurchaseStatus,
  ) {
    return this.purchaseService.changePurchaseStatusById(purchaseId, dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SUPERADMIN', 'ADMIN')
  @Delete(':purchaseId')
  deletePurchaseById(@Param('purchaseId', ParseIntPipe) purchaseId: number) {
    return this.purchaseService.deletePurchaseById(purchaseId);
  }
}
