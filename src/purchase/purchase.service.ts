import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { ChangePurchaseStatus } from './dto';

@Injectable()
export class PurchaseService {
  constructor(private prisma: PrismaService) {}

  async getAllPurchases() {
    return await this.prisma.purchase.findMany();
  }

  async getPurchasesAsCustomer(userId: number) {
    return await this.prisma.purchase.findMany({
      where: { customerId: userId },
    });
  }

  async getPurchasesAsSeller(userId: number) {
    return await this.prisma.purchase.findMany({
      where: { sellerId: userId },
    });
  }

  async getPurchaseByIdAsCustomer(purchaseId: number, userId: number) {
    const purchase = await this.prisma.purchase.findUnique({
      where: { id: purchaseId },
    });

    if (!purchase) {
      throw new NotFoundException(`Purchase with id ${purchaseId} not found.`);
    } else if (purchase.customerId !== userId) {
      throw new ForbiddenException('You are not the owner of this purchase');
    }

    return purchase;
  }

  async getPurchaseByIdAsSeller(purchaseId: number, userId: number) {
    const purchase = await this.prisma.purchase.findUnique({
      where: { id: purchaseId },
    });

    if (!purchase) {
      throw new NotFoundException(`Purchase with id ${purchaseId} not found.`);
    } else if (purchase.sellerId !== userId) {
      throw new ForbiddenException('You are not the owner of this purchase');
    }

    return purchase;
  }

  async changePurchaseStatusByIdAsSeller(
    purchaseId: number,
    userId: number,
    dto: ChangePurchaseStatus,
  ) {
    const purchase = await this.prisma.purchase.findUnique({
      where: { id: purchaseId },
    });

    if (!purchase) {
      throw new NotFoundException(`Purchase with id ${purchaseId} not found.`);
    } else if (purchase.sellerId !== userId) {
      throw new ForbiddenException('You are not the owner of this purchase');
    }

    return await this.prisma.purchase.update({
      where: { id: purchaseId },
      data: { status: dto.status },
    });
  }

  async getPurchaseById(purchaseId: number) {
    const purchase = await this.prisma.purchase.findUnique({
      where: { id: purchaseId },
    });

    if (!purchase) {
      throw new NotFoundException(`Purchase with id ${purchaseId} not found.`);
    }

    return purchase;
  }

  async changePurchaseStatusById(
    purchaseId: number,
    dto: ChangePurchaseStatus,
  ) {
    try {
      return await this.prisma.purchase.update({
        where: { id: purchaseId },
        data: { status: dto.status },
      });
    } catch (err) {
      if (err.code === 'P2025') {
        throw new NotFoundException(`Purchase with id ${purchaseId} not found`);
      }

      throw err;
    }
  }

  async deletePurchaseById(purchaseId: number) {
    try {
      return await this.prisma.purchase.delete({ where: { id: purchaseId } });
    } catch (err) {
      if (err.code === 'P2025') {
        throw new NotFoundException(`Purchase with id ${purchaseId} not found`);
      }

      throw err;
    }
  }
}
