import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseEnumPipe,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ProductService } from './product.service';
import {
  ChangeProductStatusDto,
  EditProductDto,
  MyProductsFiltersDto,
  ProductDto,
  ProductFilterDto,
} from './dto';
import { GetUser } from 'src/auth/decorator';
import { JwtAuthGuard } from 'src/auth/guard';
import { RolesGuard } from 'src/guards';
import { Roles } from 'src/decorators';
import { Status } from '@prisma/client';
import type { User } from '@prisma/client';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('products')
export class ProductController {
  constructor(private productService: ProductService) {}

  @Get()
  getAllProducts(@Query() filters: ProductFilterDto) {
    return this.productService.getAllProducts(filters);
  }

  @Get('flash-deals')
  getAllFleshDeals(@Query() filters: ProductFilterDto) {
    return this.productService.getAllFlashDeals(filters);
  }

  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard)
  @Get('myProducts')
  getMyProducts(
    @GetUser('id') userId: number,
    @Query() filters: MyProductsFiltersDto,
  ) {
    return this.productService.getMyProducts(userId, filters);
  }

  @Get(':id')
  getProductById(@Param('id', ParseIntPipe) productId: number) {
    return this.productService.getProductById(productId);
  }

  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'SUPERADMIN')
  @UseInterceptors(FileInterceptor('image'))
  @Patch(':id')
  editProductById(
    @Body() dto: EditProductDto,
    @Param('id', ParseIntPipe) productId: number,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return this.productService.editProductById(dto, productId, file);
  }

  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'SUPERADMIN')
  @Delete(':id')
  deleteProductById(@Param('id', ParseIntPipe) productId: number) {
    return this.productService.deleteProductById(productId);
  }

  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard)
  @Post()
  @UseInterceptors(FileInterceptor('image'))
  createProduct(
    @Body() dto: ProductDto,
    @GetUser('id') creatorId: number,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return this.productService.createProduct(dto, creatorId, file);
  }

  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('image'))
  @Patch('myProducts/:id')
  editMyProduct(
    @Param('id', ParseIntPipe) productId: number,
    @GetUser('id') userId: number,
    @Body() dto: EditProductDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return this.productService.editMyProduct(productId, userId, dto, file);
  }

  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard)
  @Delete('myProducts/:id')
  deleteMyProduct(
    @Param('id', ParseIntPipe) productId: number,
    @GetUser('id') userId: number,
  ) {
    return this.productService.deleteMyProduct(productId, userId);
  }

  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SUPERADMIN', 'ADMIN')
  @Get('status/:status')
  getAllProductsByStatus(
    @Param('status', new ParseEnumPipe(Status))
    status: Status,
    @Query() filters: ProductFilterDto,
  ) {
    return this.productService.getAllProductByStatus(status, filters);
  }

  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'SUPERADMIN')
  @Post('status/:productId')
  changeProductStatus(
    @Param('productId', ParseIntPipe) productId: number,
    @Body() dto: ChangeProductStatusDto,
  ) {
    return this.productService.changeProductStatus(productId, dto);
  }

  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard)
  @Get('/checkout-session/:productId')
  getCheckoutSessin(
    @Param('productId', ParseIntPipe) productId: number,
    @GetUser() user: User,
  ) {
    return this.productService.getCheckoutSession(productId, user);
  }
}
