import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ReviewService } from './review.service';
import { ReviewDto, ReviewFiltersDto } from './dto';
import { GetUser } from 'src/auth/decorator';
import { JwtAuthGuard } from 'src/auth/guard';
import { RolesGuard } from 'src/guards';
import { Roles } from 'src/decorators';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('reviews')
export class ReviewController {
  constructor(private reviewService: ReviewService) {}

  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard)
  @Get('myReviews')
  getAllMyReviews(
    @GetUser('id') userId: number,
    @Query() filters: ReviewFiltersDto,
  ) {
    return this.reviewService.getAllMyReviews(userId, filters);
  }

  @Get('/:id')
  getReviewById(@Param('id', ParseIntPipe) reviewId: number) {
    return this.reviewService.getReviewById(reviewId);
  }

  @ApiBearerAuth('access-token')
  @Get('product/:productId')
  getAllReviewsByProductId(
    @Query() filters: ReviewFiltersDto,
    @Param('productId', ParseIntPipe) productId: number,
  ) {
    return this.reviewService.getAllReviewsByProductId(productId, filters);
  }

  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard)
  @Post('/:productId')
  cretaeReview(
    @Param('productId', ParseIntPipe) productId: number,
    @GetUser('id') userId: number,
    @Body() dto: ReviewDto,
  ) {
    return this.reviewService.createReview(productId, userId, dto);
  }

  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SUPERADMIN', 'ADMIN')
  @Delete('/:reviewId')
  deleteReviewById(@Param('reviewId', ParseIntPipe) reviewId: number) {
    return this.reviewService.deleteReviewById(reviewId);
  }

  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard)
  @Delete('myReviews/:reviewId')
  deleteMyReviewById(
    @Param('reviewId', ParseIntPipe) reviewId: number,
    @GetUser('id') userId: number,
  ) {
    return this.reviewService.deleteMyReviewById(reviewId, userId);
  }

  @ApiBearerAuth('access-token')
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
