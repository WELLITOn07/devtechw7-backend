import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
} from '@nestjs/common';
import { Course, Prisma } from '@prisma/client';
import { CourseService } from '../services/course.service';
import { ParamStringId } from 'src/public/decorators/param-string-id.decorator';

@Controller('courses')
export class CourseController {
  constructor(private readonly courseService: CourseService) {}
  @Post()
  async createCourse(@Body() data: Prisma.CourseCreateInput): Promise<Course> {
    return this.courseService.createCourse(data);
  }

  @Get()
  async getCourses(): Promise<Course[]> {
    return this.courseService.getCourses();
  }

  @Get(':id')
  async getCourseById(@ParamStringId() id: string): Promise<Course | null> {
    return this.courseService.getCourseById(id);
  }

  @Put(':id')
  async updateCourse(
    @ParamStringId() id: string,
    @Body() data: Prisma.CourseUpdateInput,
  ): Promise<Course> {
    return this.courseService.updateCourse(id, data);
  }

  @Delete(':id')
  async deleteCourse(@ParamStringId() id: string): Promise<Course> {
    return this.courseService.deleteCourse(id);
  }
}
