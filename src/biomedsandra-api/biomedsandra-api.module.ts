import { Module } from '@nestjs/common';
import { CourseService } from './course/services/course.service';
import { CourseController } from './course/controllers/course.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [CourseController],
  providers: [CourseService],
})
export class BiomedsandraApiModule {}
