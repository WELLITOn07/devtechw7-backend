import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Delete,
  UseGuards,
  NotFoundException,
  HttpStatus,
} from '@nestjs/common';
import { Course, Prisma } from '@prisma/client';
import { CourseService } from '../services/course.service';
import { ParamStringId } from 'src/public/_decorators/param-string-id.decorator';
import { AuthGuard } from 'src/public/auth/_guards/auth.guard';
import { RuleAccessGuard } from 'src/public/auth/_guards/rule-access.guard';
import { RuleAccessEnum } from 'src/public/_enums/rule-access.enum';
import { RuleAccess } from 'src/public/_decorators/rule-access.decorator';

@Controller('courses')
export class CourseController {
  constructor(private readonly courseService: CourseService) {}

  @Get()
  async getCourses(): Promise<{
    statusCode: number;
    message: string;
    data: Course[];
  }> {
    try {
      const course = await this.courseService.getCourses();
      if (!course) {
        throw new NotFoundException(`Courses not found`);
      }
      return {
        statusCode: HttpStatus.OK,
        message: `Courses retrieved successfully`,
        data: course,
      };
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }

  @Get(':id')
  async getCourseById(@ParamStringId() id: string): Promise<Course | null> {
    try {
      const course = await this.courseService.getCourseById(id);
      if (!course) {
        throw new NotFoundException(`Course with ID ${id} not found`);
      }
      return course;
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }

  @RuleAccess(RuleAccessEnum.ADMIN)
  @RuleAccess(RuleAccessEnum.MODERATOR)
  @UseGuards(AuthGuard, RuleAccessGuard)
  @Post()
  async createCourse(
    @Body() data: Prisma.CourseCreateInput,
  ): Promise<{ statusCode: number; message: string; data: Course }> {
    try {
      const course = await this.courseService.createCourse(data);
      if (!course) {
        throw new NotFoundException(`Course not found for creation`);
      }
      return {
        statusCode: HttpStatus.OK,
        message: `Course created successfully`,
        data: course,
      };
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }

  @RuleAccess(RuleAccessEnum.ADMIN)
  @RuleAccess(RuleAccessEnum.MODERATOR)
  @UseGuards(AuthGuard, RuleAccessGuard)
  @Put(':id')
  async updateCourse(
    @ParamStringId() id: string,
    @Body() data: Prisma.CourseUpdateInput,
  ): Promise<{ statusCode: number; message: string; data: Course }> {
    try {
      const updatedCourse = await this.courseService.updateCourse(id, data);
      if (!updatedCourse) {
        throw new NotFoundException(
          `Course with ID ${id} not found for update`,
        );
      }
      return {
        statusCode: HttpStatus.OK,
        message: `Course with ID ${id} updated successfully`,
        data: updatedCourse,
      };
    } catch (error) {
      throw new NotFoundException(
        `Failed to update course with ID ${id}: ${error.message}`,
      );
    }
  }

  @RuleAccess(RuleAccessEnum.ADMIN)
  @RuleAccess(RuleAccessEnum.MODERATOR)
  @UseGuards(AuthGuard, RuleAccessGuard)
  @Delete(':id')
  async deleteCourse(
    @ParamStringId() id: string,
  ): Promise<{ statusCode: number; message: string }> {
    try {
      const deletedCourse = await this.courseService.deleteCourse(id);

      if (!deletedCourse) {
        throw new NotFoundException(
          `Course with ID ${id} not found for deletion`,
        );
      }

      return {
        statusCode: HttpStatus.OK,
        message: `Course with ID ${id} was successfully deleted`,
      };
    } catch (error) {
      throw new NotFoundException(
        `Failed to delete course with ID ${id}: ${error.message}`,
      );
    }
  }
}
