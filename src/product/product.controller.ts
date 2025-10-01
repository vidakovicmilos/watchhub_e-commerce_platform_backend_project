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
  UseGuards,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { ChangeProductStatusDto, ProductDto } from './dto';
import { GetUser } from 'src/auth/decorator';
import { JwtAuthGuard } from 'src/auth/guard';
import { RolesGuard } from 'src/guards';
import { Roles } from 'src/decorators';
import { Status } from '@prisma/client';

@Controller('products')
export class ProductController {
  constructor(private productService: ProductService) {}

  @Get()
  getAllProducts() {
    return this.productService.getAllProducts();
  }

  @UseGuards(JwtAuthGuard)
  @Get('myProducts')
  getMyProducts(@GetUser('id') userId: number) {
    return this.productService.getMyProducts(userId);
  }

  @Get(':id')
  getProductById(@Param('id', ParseIntPipe) productId: number) {
    return this.productService.getProductById(productId);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'SUPERADMIN')
  @Patch(':id')
  editProductById(
    @Body() dto: ProductDto,
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
    @Body() dto: ProductDto,
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
  ) {
    return this.productService.getAllProductByStatus(status);
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
