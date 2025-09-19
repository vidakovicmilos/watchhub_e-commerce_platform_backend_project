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
import { BrandService } from './brand.service';
import { BrandDto } from './dto';
import { JwtAuthGuard } from 'src/auth/guard';
import { RolesGuard } from 'src/guards';
import { Roles } from 'src/decorators';

@Controller('brands')
export class BrandController {
  constructor(private brandService: BrandService) {}

  @Get()
  getAllBrands() {
    return this.brandService.getAllBrand();
  }

  @Get(':id')
  getBrandById(@Param('id', ParseIntPipe) brandId: number) {
    return this.brandService.getBrandById(brandId);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SUPERADMIN')
  @Patch(':id')
  editBrandById(
    @Param('id', ParseIntPipe) brandId: number,
    @Body() dto: BrandDto,
  ) {
    return this.brandService.editBrandById(brandId, dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SUPERADMIN')
  @Delete(':id')
  deleteBrandById(@Param('id', ParseIntPipe) brandId: number) {
    return this.brandService.deleteBrandById(brandId);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SUPERADMIN')
  @Post()
  createBrand(@Body() dto: BrandDto) {
    return this.brandService.createBrand(dto);
  }
}
