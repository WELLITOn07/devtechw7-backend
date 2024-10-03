import { Module } from '@nestjs/common';
import { CourseService } from './course/services/course.service';
import { CourseController } from './course/controllers/course.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  controllers: [CourseController],
  providers: [CourseService, PrismaModule],
})
export class BiomedsandraApiModule {}
