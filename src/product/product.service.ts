import {
  Body,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { ChangeProductStatusDto, ProductDto } from './dto';
import { Status } from '@prisma/client';

@Injectable()
export class ProductService {
  constructor(private prisma: PrismaService) {}

  async getAllProducts() {
    const products = await this.prisma.product.findMany({
      where: { status: 'APPROVED' },
    });

    return products;
  }

  async getProductById(productId) {
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      throw new NotFoundException(`Product with id ${productId} not found.`);
    }

    return product;
  }

  async editProductById(dto: ProductDto, productId: number) {
    try {
      const product = await this.prisma.product.update({
        where: { id: productId },
        data: { ...dto },
      });

      return product;
    } catch (err) {
      if (err.code === 'P2003') {
        throw new NotFoundException(`Brand with id ${dto.brandId} not found`);
      }
      throw err;
    }
  }

  async deleteProductById(productId: number) {
    try {
      const product = await this.prisma.product.delete({
        where: { id: productId },
      });

      return {
        message: `User with id ${productId} was sucessfuly deleted!`,
        product,
      };
    } catch (err) {
      if (err.code === 'P2025') {
        throw new NotFoundException(`Product with id ${productId} not found`);
      }

      throw err;
    }
  }

  async createProduct(dto: ProductDto, creatorId: number) {
    try {
      const product = await this.prisma.product.create({
        data: {
          ...dto,
          creatorId,
        },
      });

      return product;
    } catch (err) {
      if (err.code === 'P2003') {
        throw new NotFoundException(`Brand with id ${dto.brandId} not found`);
      }
      throw err;
    }
  }

  async getMyProducts(userId: number) {
    return await this.prisma.product.findMany({ where: { creatorId: userId } });
  }

  async editMyProduct(productId: number, userId: number, dto: ProductDto) {
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      throw new NotFoundException(`Product with id ${productId} not found!`);
    } else if (product.creatorId !== userId) {
      throw new ForbiddenException('You are not the owner of this product');
    }

    return await this.prisma.product.update({
      where: {
        id: productId,
      },
      data: { ...dto },
    });
  }

  async deleteMyProduct(productId: number, userId: number) {
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      throw new NotFoundException(`Product with id ${productId} not found!`);
    } else if (product.creatorId !== userId) {
      throw new ForbiddenException('You are not the owner of this product');
    }

    return await this.prisma.product.delete({ where: { id: productId } });
  }

  async getAllProductByStatus(status: Status) {
    return await this.prisma.product.findMany({
      where: { status: status },
    });
  }

  async changeProductStatus(productId: number, dto: ChangeProductStatusDto) {
    try {
      return await this.prisma.product.update({
        where: { id: productId },
        data: { status: dto.status },
      });
    } catch (err) {
      if (err.code === 'P2025') {
        throw new NotFoundException(`Product with id ${productId} not found`);
      }

      throw err;
    }
  }
}
