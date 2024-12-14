import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { PrismaClient } from '@prisma/client';
import { ValidationPipe } from '@nestjs/common';
import { HttpExceptionFilter } from './public/_filters/http-exception.filter';

async function bootstrap() {
  const prisma = new PrismaClient();
  await prisma.$connect();
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: (origin, callback) => {
      const allowedOriginsProd = [
        'https://devtechw7-dashboard-1f09b.web.app',
        'https://biomedsandra.com.br',
      ];
      const allowedOriginsDev = [
        'http://localhost:8080',
        'http://localhost:4200',
        'http://localhost:3000',
      ];

      const isDevelopment = process.env.NODE_ENV === 'development';

      const allowedOrigins = isDevelopment
        ? allowedOriginsDev
        : allowedOriginsProd;

      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true); 
      } else {
        callback(new Error('Not allowed by CORS')); 
      }
    },
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: 'Content-Type, Authorization',
    credentials: true,
  });

  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalFilters(new HttpExceptionFilter());

  await app.listen(3000, '0.0.0.0');
}
bootstrap();
