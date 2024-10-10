import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { PrismaClient } from '@prisma/client';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const prisma = new PrismaClient();
  await prisma.$connect();

  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: [
      'http://localhost',
      'https://devtechw7-backend-small-violet-5481.fly.dev',
    ],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    preflightContinue: false,
    optionsSuccessStatus: 204,
  });

  app.useGlobalPipes(new ValidationPipe());
  await app.listen(3000, '0.0.0.0');
}
bootstrap();
