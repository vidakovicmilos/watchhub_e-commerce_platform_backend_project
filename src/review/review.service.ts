import {
  Injectable,
  BadRequestException,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { ReviewDto, ReviewFiltersDto } from './dto';

@Injectable()
export class ReviewService {
  constructor(private prisma: PrismaService) {}

  async getAllMyReviews(userId: number, filters: ReviewFiltersDto) {
    const sort = filters.sort ?? 'rating';
    const limit = filters.limit || 20;
    const skipProducts = filters.page ? (filters.page - 1) * limit : 0;
    return await this.prisma.review.findMany({
      skip: skipProducts,
      take: limit,
      where: {
        userId,
        rating: {
          gte: filters.minRating,
          lte: filters.maxRating,
        },
      },
      orderBy: { [sort as any]: filters.order ?? 'asc' },
    });
  }

  async getReviewById(reviewId: number) {
    const review = await this.prisma.review.findUnique({
      where: { id: reviewId },
    });

    if (!review) {
      throw new BadRequestException(`Brand with Id ${reviewId} not found!`);
    }

    return review;
  }

  async getAllReviewsByProductId(productId: number, filters: ReviewFiltersDto) {
    const sort = filters.sort ?? 'rating';
    const limit = filters.limit || 20;
    const skipProducts = filters.page ? (filters.page - 1) * limit : 0;
    return await this.prisma.review.findMany({
      skip: skipProducts,
      take: limit,
      where: {
        productId,
        rating: {
          gte: filters.minRating,
          lte: filters.maxRating,
        },
      },
      orderBy: { [sort as any]: filters.order ?? 'asc' },
    });
  }

  async createReview(productId: number, userId: number, dto: ReviewDto) {
    try {
      const product = await this.prisma.product.findUnique({
        where: { id: productId },
      });

      if (!product) {
        throw new NotFoundException(`Product with id ${productId} not found`);
      }

      if (product?.status !== 'APPROVED') {
        throw new BadRequestException(
          'You cannot review a product that is not approved.',
        );
      }

      const review = await this.prisma.review.create({
        data: {
          productId,
          userId,
          rating: dto.rating,
          text: dto.text,
        },
      });

      const oldAverageRating = product.averageRating ?? 0;
      const ratingCount = product.ratingCount ?? 0;
      const newRatingCount = ratingCount + 1;

      const newAverageRating =
        Math.round(
          ((oldAverageRating * ratingCount + review.rating) / newRatingCount) *
            10,
        ) / 10;

      await this.prisma.product.update({
        where: { id: productId },
        data: {
          averageRating: newAverageRating,
          ratingCount: newRatingCount,
        },
      });

      return review;
    } catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError) {
        if (err.code === 'P2002') {
          throw new BadRequestException(
            'User has already submitted a review for this product.',
          );
        }
      }
      throw err;
    }
  }

  async deleteReviewById(reviewId: number) {
    try {
      const review = await this.prisma.review.delete({
        where: { id: reviewId },
      });

      const product = await this.prisma.product.findUnique({
        where: { id: review.productId },
      });

      const ratingCount = product?.ratingCount ?? 0;
      const newRatingCount = ratingCount - 1;

      if (newRatingCount <= 0) {
        await this.prisma.product.update({
          where: { id: review.productId },
          data: {
            averageRating: 0,
            ratingCount: 0,
          },
        });
        return review;
      }

      const oldAverageRating = product?.averageRating ?? 0;
      const newAverageRating =
        Math.round(
          ((oldAverageRating * ratingCount - review.rating) / newRatingCount) *
            10,
        ) / 10;

      await this.prisma.product.update({
        where: { id: review.productId },
        data: { averageRating: newAverageRating, ratingCount: newRatingCount },
      });

      return review;
    } catch (err) {
      if (err.code === 'P2025') {
        throw new NotFoundException(`Review with id ${reviewId} not found`);
      }

      throw err;
    }
  }

  async editMyReview(reviewId: number, userId: number, dto: ReviewDto) {
    const review = await this.prisma.review.findUnique({
      where: { id: reviewId },
    });

    if (!review) {
      throw new NotFoundException(`Review with id ${reviewId} not found`);
    }

    if (review.userId !== userId) {
      throw new ForbiddenException('You are not the owner of this review');
    }

    const product = await this.prisma.product.findUnique({
      where: { id: review.productId },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    const oldAverageRating = product.averageRating ?? 0;
    const ratingCount = product.ratingCount ?? 0;

    const updatedReview = await this.prisma.review.update({
      where: { id: reviewId },
      data: {
        rating: dto.rating,
        text: dto.text,
      },
    });

    const newAverageRating =
      Math.round(
        ((oldAverageRating * ratingCount -
          review.rating +
          updatedReview.rating) /
          ratingCount) *
          10,
      ) / 10;

    await this.prisma.product.update({
      where: { id: review.productId },
      data: { averageRating: newAverageRating },
    });

    return updatedReview;
  }

  async deleteMyReviewById(reviewId: number, userId: number) {
    const review = await this.prisma.review.findUnique({
      where: { id: reviewId },
    });

    if (!review) {
      throw new NotFoundException(`Review with id ${reviewId} not found`);
    }

    if (review.userId !== userId) {
      throw new ForbiddenException('You are not the owner of this review');
    }

    const product = await this.prisma.product.findUnique({
      where: { id: review.productId },
    });

    const oldAverageRating = product?.averageRating ?? 0;
    const ratingCount = product?.ratingCount ?? 0;
    const newRatingCount = ratingCount - 1;

    if (newRatingCount <= 0) {
      await this.prisma.product.update({
        where: { id: review.productId },
        data: {
          averageRating: 0,
          ratingCount: 0,
        },
      });

      return await this.prisma.review.delete({ where: { id: reviewId } });
    }

    const newAverageRating =
      Math.round(
        ((oldAverageRating * ratingCount - review.rating) / newRatingCount) *
          10,
      ) / 10;

    await this.prisma.product.update({
      where: { id: review.productId },
      data: { averageRating: newAverageRating, ratingCount: newRatingCount },
    });

    return await this.prisma.review.delete({ where: { id: reviewId } });
  }
}
