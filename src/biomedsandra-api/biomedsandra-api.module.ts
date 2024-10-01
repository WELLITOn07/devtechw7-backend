import { Module } from '@nestjs/common';
import { CourseService } from './course/services/course.service';
import { CourseController } from './course/controllers/course.controller';

@Module({
    imports: [],
    controllers: [CourseController],
    providers: [CourseService],
})
export class BiomedsandraApiModule {}
