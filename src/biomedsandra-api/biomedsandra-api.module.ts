import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { CourseService } from './course/services/course.service';
import { CourseController } from './course/controllers/course.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { CheckStringIdMiddleware } from 'src/public/_middlewares/check-string-id.middleware';

@Module({
  imports: [PrismaModule],
  controllers: [CourseController],
  providers: [CourseService],
})
export class BiomedsandraApiModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(CheckStringIdMiddleware).forRoutes({
      path: 'courses/:id',
      method: RequestMethod.ALL,
    });
  }
}
