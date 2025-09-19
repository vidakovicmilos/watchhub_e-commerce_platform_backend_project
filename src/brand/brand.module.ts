import { Module } from '@nestjs/common';
import { BrandService } from './brand.service';
import { BrandController } from './brand.controller';

@Module({
  providers: [BrandService],
  controllers: [BrandController],
})
export class BrandModule {}
