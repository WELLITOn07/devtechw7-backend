import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { CourseService } from './course/services/course.service';
import { CourseController } from './course/controllers/course.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { CourseIdCheckMiddleware } from './course/middlewares/course-id-check.middleware';

@Module({
  imports: [PrismaModule],
  controllers: [CourseController],
  providers: [CourseService],
})
export class BiomedsandraApiModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(CourseIdCheckMiddleware).forRoutes({
      path: 'courses/:id',
      method: RequestMethod.ALL,
    });
  }
}
