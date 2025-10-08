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
      return await this.prisma.review.create({
        data: {
          productId,
          userId,
          rating: dto.rating,
          text: dto.text,
        },
      });
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
      return await this.prisma.review.delete({ where: { id: reviewId } });
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

    return await this.prisma.review.update({
      where: { id: reviewId },
      data: {
        rating: dto.rating,
        text: dto.text,
      },
    });
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

    return await this.prisma.review.delete({ where: { id: reviewId } });
  }
}
