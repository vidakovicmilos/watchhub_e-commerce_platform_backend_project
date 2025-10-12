import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as express from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Apply global validation pipe to automatically validate incoming requests
  // 'whitelist: true' removes any properties that are not in the DTO
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  app.use('/stripe-webhook', express.raw({ type: 'application/json' }));
  await app.listen(process.env.PORT ?? 3333);
}
bootstrap();
