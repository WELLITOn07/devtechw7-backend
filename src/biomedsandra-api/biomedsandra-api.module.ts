import { Module } from '@nestjs/common';
import { CourseService } from './course/services/course.service';
import { CourseController } from './course/controllers/course.controller';
import { PrismaService } from 'src/database/prisma.service';

@Module({
  controllers: [CourseController],
  providers: [CourseService, PrismaService],
})
export class BiomedsandraApiModule {}
