import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Course, Prisma } from '@prisma/client';
import { CourseService } from '../services/course.service';

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
  async getCourseById(@Param('id') id: string): Promise<Course | null> {
    return this.courseService.getCourseById(id);
  }

  @Put(':id')
  async updateCourse(
    @Param('id') id: string,
    @Body() data: Prisma.CourseUpdateInput,
  ): Promise<Course> {
    return this.courseService.updateCourse(id, data);
  }

  @Delete(':id')
  async deleteCourse(@Param('id') id: string): Promise<Course> {
    return this.courseService.deleteCourse(id);
  }

  @Get('health-check')
  async healthCheck(): Promise<string> {
    try {
      await this.courseService.getCourses();
      return 'OK';
    } catch (error) {
      throw new HttpException('Erro ao realizar o health-check', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}

