import {
  BadRequestException,
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
import type { User } from '@prisma/client';
import { PriceUtils } from './utils';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import Stripe from 'stripe';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ProductService {
  private stripe: Stripe;
  constructor(
    private prisma: PrismaService,
    private cloudinaryService: CloudinaryService,
    private config: ConfigService,
  ) {
    this.stripe = new Stripe(this.config.get('STRIPE_SECRET_KEY')!, {
      apiVersion: this.config.get('STRIPE_API_VERSION'),
    });
  }

  async getAllProducts(filters: ProductFilterDto) {
    const limit = filters.limit || 20;
    const skipProducts = filters.page ? (filters.page - 1) * limit : 0;
    const sort = filters.sort ?? 'finalPrice';

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
      orderBy: {
        [sort as any]: filters.order ?? 'asc',
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
    const sort = filters.sort ?? 'finalPrice';

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
      orderBy: {
        [sort as any]: filters.order ?? 'asc',
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

  async editProductById(
    dto: EditProductDto,
    productId: number,
    file?: Express.Multer.File,
  ) {
    try {
      let imageUrl: string | undefined;
      let publicId: string | undefined;
      let product = await this.prisma.product.update({
        where: { id: productId },
        data: { ...dto },
      });

      const finalPrice = PriceUtils.calculateFinalPrice(
        product.price,
        product.discount,
      );

      if (file && product.imagePublicId) {
        await this.cloudinaryService.deleteImage(product.imagePublicId);
      }

      if (file) {
        const image = await this.cloudinaryService.uploadImage(file);
        imageUrl = image.secure_url;
        publicId = image.public_id;
      }

      product = await this.prisma.product.update({
        where: { id: productId },
        data: { finalPrice, imageUrl, imagePublicId: publicId },
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

      if (product.imagePublicId) {
        await this.cloudinaryService.deleteImage(product.imagePublicId);
      }

      return product;
    } catch (err) {
      if (err.code === 'P2025') {
        throw new NotFoundException(`Product with id ${productId} not found`);
      }

      throw err;
    }
  }

  async createProduct(
    dto: ProductDto,
    creatorId: number,
    file?: Express.Multer.File,
  ) {
    try {
      let imageUrl: string | undefined;
      let publicId: string | undefined;

      if (file) {
        const image = await this.cloudinaryService.uploadImage(file);
        imageUrl = image.secure_url;
        publicId = image.public_id;
      }

      const discount = dto.discount ? dto.discount : 0;
      const finalPrice = PriceUtils.calculateFinalPrice(dto.price, discount);
      const product = await this.prisma.product.create({
        data: {
          ...dto,
          creatorId,
          finalPrice,
          imageUrl,
          imagePublicId: publicId,
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
    const sort = filters.sort ?? 'finalPrice';
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
      orderBy: {
        [sort as any]: filters.order ?? 'asc',
      },
    });
  }

  async editMyProduct(
    productId: number,
    userId: number,
    dto: EditProductDto,
    file?: Express.Multer.File,
  ) {
    let imageUrl: string | undefined;
    let publicId: string | undefined;
    let product = await this.prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      throw new NotFoundException(`Product with id ${productId} not found!`);
    } else if (product.creatorId !== userId) {
      throw new ForbiddenException('You are not the owner of this product');
    }

    if (file && product.imagePublicId) {
      await this.cloudinaryService.deleteImage(product.imagePublicId);
    }

    if (file) {
      const image = await this.cloudinaryService.uploadImage(file);
      imageUrl = image.secure_url;
      publicId = image.public_id;
    }

    const price = dto.price ?? product.price;
    const discount = dto.discount ?? product.discount;

    const finalPrice = PriceUtils.calculateFinalPrice(price, discount);

    return await this.prisma.product.update({
      where: {
        id: productId,
      },
      data: {
        ...dto,
        finalPrice,
        discount,
        price,
        imageUrl,
        imagePublicId: publicId,
      },
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

    if (product.imagePublicId) {
      await this.cloudinaryService.deleteImage(product.imagePublicId);
    }

    return await this.prisma.product.delete({ where: { id: productId } });
  }

  async getAllProductByStatus(status: Status, filters: ProductFilterDto) {
    const sort = filters.sort ?? 'finalPrice';
    const limit = filters.limit || 20;
    const skipProducts = filters.page ? (filters.page - 1) * limit : 0;
    return await this.prisma.product.findMany({
      skip: skipProducts,
      take: limit,
      where: {
        status: status,
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
      orderBy: {
        [sort as any]: filters.order ?? 'asc',
      },
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

  async getCheckoutSession(productId: number, user: User) {
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      throw new NotFoundException(`Product with id ${productId} not found!`);
    } else if (product.status !== 'APPROVED') {
      throw new BadRequestException(
        `Product with id ${productId} is not approved for sale.`,
      );
    }
    const price = product.finalPrice ?? product.price;

    const session = await this.stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      customer_email: user.email,
      line_items: [
        {
          price_data: {
            currency: 'eur',
            product_data: {
              name: product.name,
            },
            unit_amount: price * 100,
          },
          quantity: 1,
        },
      ],
      success_url:
        'https://github.com/vidakovicmilos/watchhub_e-commerce_platform_backend_project', // This is placeholder for frontend url
      cancel_url: 'https://localhost:3333/cancel', // This is placeholder for frontend url
      shipping_address_collection: {
        allowed_countries: ['ME', 'RS', 'HR', 'BA', 'XK', 'AL'],
      },
      metadata: {
        productId: product.id.toString(),
        customerId: user.id.toString(),
        sellerId: product.creatorId,
        customerEmail: user.email,
      },
    });

    return { url: session.url };
  }
}
