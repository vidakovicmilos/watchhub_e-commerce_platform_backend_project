import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { AdminModule } from './admin/admin.module';
import { BrandModule } from './brand/brand.module';
import { ProductModule } from './product/product.module';
import { ReviewModule } from './review/review.module';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { StripeWebhookModule } from './stripe-webhook/stripe-webhook.module';

@Module({
  imports: [
    UserModule,
    AuthModule,
    PrismaModule,
    ConfigModule.forRoot({ isGlobal: true }),
    AdminModule,
    BrandModule,
    ProductModule,
    ReviewModule,
    CloudinaryModule,
    StripeWebhookModule,
  ],
})
export class AppModule {}
