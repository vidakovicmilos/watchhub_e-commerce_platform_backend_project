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
import { BrandService } from './brand.service';
import { BrandDto, BrandFiltersDto } from './dto';
import { JwtAuthGuard } from 'src/auth/guard';
import { RolesGuard } from 'src/guards';
import { Roles } from 'src/decorators';

@Controller('brands')
export class BrandController {
  constructor(private brandService: BrandService) {}

  @Get()
  getAllBrands(@Query() filters: BrandFiltersDto) {
    return this.brandService.getAllBrand(filters);
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
  @Roles('SUPERADMIN', 'ADMIN')
  @Delete(':id')
  deleteBrandById(@Param('id', ParseIntPipe) brandId: number) {
    return this.brandService.deleteBrandById(brandId);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SUPERADMIN', 'ADMIN')
  @Post()
  createBrand(@Body() dto: BrandDto) {
    return this.brandService.createBrand(dto);
  }
}
