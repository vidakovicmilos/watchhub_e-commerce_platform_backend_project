import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  ChangeProductStatusDto,
  EditProductDto,
  MyProductsFiltersDto,
  ProductDto,
  ProductFilterDto,
} from './dto';
import { Status } from '@prisma/client';
import { PriceUtils } from './utils';

@Injectable()
export class ProductService {
  constructor(private prisma: PrismaService) {}

  async getAllProducts(filters: ProductFilterDto) {
    const limit = filters.limit || 20;
    const skipProducts = filters.page ? (filters.page - 1) * limit : 0;

    const products = await this.prisma.product.findMany({
      skip: skipProducts,
      take: limit,
      where: {
        status: 'APPROVED',
        finalPrice: {
          gte: filters.minPrice,
          lte: filters.maxPrice,
        },
        gender: filters.gender,
        discount: {
          gte: filters.minDiscount,
          lte: filters.maxDiscount,
        },
        brandId: filters.brandId,
      },
    });

    return products;
  }

  async getAllFlashDeals(filters: ProductFilterDto) {
    const minDiscount =
      filters.minDiscount && filters.minDiscount >= 25
        ? filters.minDiscount
        : 25;

    const limit = filters.limit || 20;
    const skipProducts = filters.page ? (filters.page - 1) * limit : 0;

    const products = await this.prisma.product.findMany({
      skip: skipProducts,
      take: limit,
      where: {
        status: 'APPROVED',
        finalPrice: {
          gte: filters.minPrice,
          lte: filters.maxPrice,
        },
        gender: filters.gender,
        discount: {
          gte: minDiscount,
          lte: filters.maxDiscount,
        },
        brandId: filters.brandId,
      },
    });

    return products;
  }

  async getProductById(productId: number) {
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      throw new NotFoundException(`Product with id ${productId} not found.`);
    }

    return product;
  }

  async editProductById(dto: EditProductDto, productId: number) {
    try {
      let product = await this.prisma.product.update({
        where: { id: productId },
        data: { ...dto },
      });

      const finalPrice = PriceUtils.calculateFinalPrice(
        product.price,
        product.discount,
      );

      product = await this.prisma.product.update({
        where: { id: productId },
        data: { finalPrice },
      });

      return product;
    } catch (err) {
      if (err.code === 'P2003') {
        throw new NotFoundException(`Brand with id ${dto.brandId} not found`);
      }
      if (err.code === 'P2025') {
        throw new NotFoundException(`Product with id ${productId} not found`);
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
      const discount = dto.discount ? dto.discount : 0;
      const finalPrice = PriceUtils.calculateFinalPrice(dto.price, discount);
      const product = await this.prisma.product.create({
        data: {
          ...dto,
          creatorId,
          finalPrice,
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

  async getMyProducts(userId: number, filters: MyProductsFiltersDto) {
    const limit = filters.limit || 20;
    const skipProducts = filters.page ? (filters.page - 1) * limit : 0;
    return await this.prisma.product.findMany({
      skip: skipProducts,
      take: limit,
      where: {
        status: filters.status,
        creatorId: userId,
        finalPrice: {
          gte: filters.minDiscount,
          lte: filters.maxPrice,
        },
        gender: filters.gender,
        discount: {
          gte: filters.minDiscount,
          lte: filters.maxDiscount,
        },
        brandId: filters.brandId,
      },
    });
  }

  async editMyProduct(productId: number, userId: number, dto: EditProductDto) {
    let product = await this.prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      throw new NotFoundException(`Product with id ${productId} not found!`);
    } else if (product.creatorId !== userId) {
      throw new ForbiddenException('You are not the owner of this product');
    }

    const price = dto.price ?? product.price;
    const discount = dto.discount ?? product.discount;

    const finalPrice = PriceUtils.calculateFinalPrice(price, discount);

    return await this.prisma.product.update({
      where: {
        id: productId,
      },
      data: { ...dto, finalPrice, discount, price },
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
