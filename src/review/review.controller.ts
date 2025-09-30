import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ReviewService } from './review.service';
import { ReviewDto } from './dto';
import { GetUser } from 'src/auth/decorator';
import { JwtAuthGuard } from 'src/auth/guard';
import { RolesGuard } from 'src/guards';
import { Roles } from 'src/decorators';

@Controller('reviews')
export class ReviewController {
  constructor(private reviewService: ReviewService) {}

  @UseGuards(JwtAuthGuard)
  @Get('myReviews')
  getAllMyReviews(@GetUser('id') userId: number) {
    return this.reviewService.getAllMyReviews(userId);
  }

  @Get('/:id')
  getReviewById(@Param('id', ParseIntPipe) reviewId: number) {
    return this.reviewService.getReviewById(reviewId);
  }

  @Get('product/:productId')
  getAllReviewsByProductId(
    @Param('productId', ParseIntPipe) productId: number,
  ) {
    return this.reviewService.getAllReviewsByProductId(productId);
  }

  @UseGuards(JwtAuthGuard)
  @Post('/:productId')
  cretaeReview(
    @Param('productId', ParseIntPipe) productId: number,
    @GetUser('id') userId: number,
    @Body() dto: ReviewDto,
  ) {
    return this.reviewService.createReview(productId, userId, dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SUPERADMIN', 'ADMIN')
  @Delete('/:reviewId')
  deleteReviewById(@Param('reviewId', ParseIntPipe) reviewId: number) {
    return this.reviewService.deleteReviewById(reviewId);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('myReviews/:reviewId')
  deleteMyReviewById(
    @Param('reviewId', ParseIntPipe) reviewId: number,
    @GetUser('id') userId: number,
  ) {
    return this.reviewService.deleteMyReviewById(reviewId, userId);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('myReviews/:reviewId')
  editMyReview(
    @Param('reviewId', ParseIntPipe) reviewId: number,
    @GetUser('id') userId: number,
    @Body() dto: ReviewDto,
  ) {
    return this.reviewService.editMyReview(reviewId, userId, dto);
  }
}
