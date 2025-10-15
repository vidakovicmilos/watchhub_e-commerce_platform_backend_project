import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  ChangePurchaseStatus,
  PurchaseAdminFiltersDto,
  PurchaseCustomerFiltersDto,
  PurchaseSellerFiltersDto,
} from './dto';
import { filter } from 'rxjs';

@Injectable()
export class PurchaseService {
  constructor(private prisma: PrismaService) {}

  async getAllPurchases(filters: PurchaseAdminFiltersDto) {
    const limit = filters.limit || 20;
    const skipProducts = filters.page ? (filters.page - 1) * limit : 0;
    const sort = filters.sort ?? 'createdAt';
    return await this.prisma.purchase.findMany({
      skip: skipProducts,
      take: limit,
      where: {
        status: filters.status,
        customerId: filters.customerId,
        sellerId: filters.sellerId,
      },
      orderBy: {
        [sort as any]: filters.order ?? 'asc',
      },
    });
  }

  async getPurchasesAsCustomer(
    userId: number,
    filters: PurchaseCustomerFiltersDto,
  ) {
    const limit = filters.limit || 20;
    const skipProducts = filters.page ? (filters.page - 1) * limit : 0;
    const sort = filters.sort ?? 'createdAt';
    return await this.prisma.purchase.findMany({
      skip: skipProducts,
      take: limit,
      where: {
        status: filters.status,
        customerId: userId,
        sellerId: filters.sellerId,
      },
      orderBy: {
        [sort as any]: filters.order ?? 'asc',
      },
    });
  }

  async getPurchasesAsSeller(
    userId: number,
    filters: PurchaseSellerFiltersDto,
  ) {
    const limit = filters.limit || 20;
    const skipProducts = filters.page ? (filters.page - 1) * limit : 0;
    const sort = filters.sort ?? 'createdAt';
    return await this.prisma.purchase.findMany({
      skip: skipProducts,
      take: limit,
      where: {
        status: filters.status,
        sellerId: userId,
        customerId: filters.customerId,
      },
      orderBy: {
        [sort as any]: filters.order ?? 'asc',
      },
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
