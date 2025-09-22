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
import { ProductService } from './product.service';
import { ProductDto } from './dto';
import { GetUser } from 'src/auth/decorator';
import { JwtAuthGuard } from 'src/auth/guard';
import { RolesGuard } from 'src/guards';
import { Roles } from 'src/decorators';

@Controller('products')
export class ProductController {
  constructor(private productService: ProductService) {}

  @Get()
  getAllProducts() {
    return this.productService.getAllProducts();
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
}
