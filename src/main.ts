import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { PrismaClient } from '@prisma/client';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const prisma = new PrismaClient();
  await prisma.$connect();

  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: ['biomedsandra.com.br'],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    preflightContinue: false
  });

  app.useGlobalPipes(new ValidationPipe());
  await app.listen(3000, '0.0.0.0');
}
bootstrap();
