import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { BrandDto } from './dto';

@Injectable()
export class BrandService {
  constructor(private prisma: PrismaService) {}

  async getAllBrand() {
    const brands = await this.prisma.brand.findMany();

    return brands;
  }

  async getBrandById(brandId: number) {
    const brand = await this.prisma.brand.findUnique({
      where: { id: brandId },
    });

    if (!brand) {
      throw new BadRequestException(`Brand with Id ${brandId} not found!`);
    }

    return brand;
  }

  async editBrandById(brandId: number, dto: BrandDto) {
    const brand = await this.prisma.brand.findUnique({
      where: { id: brandId },
    });

    if (!brand) {
      throw new BadRequestException(`Brand with Id ${brandId} not found!`);
    }

    const newBrand = await this.prisma.brand.update({
      where: { id: brandId },
      data: { ...dto },
    });

    return newBrand;
  }

  async deleteBrandById(brandId: number) {
    const brand = await this.prisma.brand.findUnique({
      where: { id: brandId },
    });

    if (!brand) {
      throw new BadRequestException(`Brand with Id ${brandId} not found!`);
    }

    await this.prisma.brand.delete({ where: { id: brandId } });
    return { message: `Brand with id ${brandId} was sucessfuly deleted!` };
  }

  async createBrand(dto: BrandDto) {
    try {
      const brand = await this.prisma.brand.create({
        data: {
          ...dto,
        },
      });
      return brand;
    } catch (error) {
      if (error.code === 'P2002') {
        throw new BadRequestException(
          `The brand with this name: ${dto.name} already exists in database!`,
        );
      } else {
        throw new InternalServerErrorException('Something went wrong');
      }
    }
  }
}
