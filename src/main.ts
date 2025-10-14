import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as express from 'express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('API')
    .setVersion('1.0')
    .addBearerAuth(
      { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
      'access-token',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  // Apply global validation pipe to automatically validate incoming requests
  // 'whitelist: true' removes any properties that are not in the DTO
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  app.use('/stripe-webhook', express.raw({ type: 'application/json' }));
  await app.listen(process.env.PORT ?? 3333);
}
bootstrap();
