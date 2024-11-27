import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { ApplicationService } from './_services/aplication.service';
import { ApplicationController } from './_controllers/aplication.controller';

@Module({
  controllers: [ApplicationController],
  providers: [ApplicationService, PrismaService],
  exports: [ApplicationService],
})
export class ApplicationModule {}
