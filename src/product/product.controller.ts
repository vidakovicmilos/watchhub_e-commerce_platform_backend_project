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
  UseGuards,
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

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'SUPERADMIN')
  @Patch(':id')
  editProductById(
    @Body() dto: EditProductDto,
    @Param('id', ParseIntPipe) productId: number,
  ) {
    return this.productService.editProductById(dto, productId);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'SUPERADMIN')
  @Delete(':id')
  deleteProductById(@Param('id', ParseIntPipe) productId: number) {
    return this.productService.deleteProductById(productId);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  createProduct(@Body() dto: ProductDto, @GetUser('id') creatorId: number) {
    return this.productService.createProduct(dto, creatorId);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('myProducts/:id')
  editMyProduct(
    @Param('id', ParseIntPipe) productId: number,
    @GetUser('id') userId: number,
    @Body() dto: EditProductDto,
  ) {
    return this.productService.editMyProduct(productId, userId, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('myProducts/:id')
  deleteMyProduct(
    @Param('id', ParseIntPipe) productId: number,
    @GetUser('id') userId: number,
  ) {
    return this.productService.deleteMyProduct(productId, userId);
  }

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

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'SUPERADMIN')
  @Post('status/:productId')
  changeProductStatus(
    @Param('productId', ParseIntPipe) productId: number,
    @Body() dto: ChangeProductStatusDto,
  ) {
    return this.productService.changeProductStatus(productId, dto);
  }
}
