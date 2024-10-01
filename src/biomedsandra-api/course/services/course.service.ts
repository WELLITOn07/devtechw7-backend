import { Injectable } from '@nestjs/common';
import { Course, Prisma } from '@prisma/client';
import { PrismaService } from 'src/database/prisma.service';

@Injectable()
export class CourseService {
  constructor(private prisma: PrismaService) {}

  async createCourse(data: Prisma.CourseCreateInput): Promise<Course> {
    return this.prisma.course.create({
      data,
      include: {
        price: true,
        subjects: true,
        works: true,
      },
    });
  }

  async getCourses(): Promise<Course[]> {
    return this.prisma.course.findMany({
      include: {
        price: true,
        subjects: true,
        works: true,
      },
    });
  }

  async getCourseById(id: string): Promise<Course | null> {
    return this.prisma.course.findUnique({
      where: { id },
      include: {
        price: true,
        subjects: true,
        works: true,
      },
    });
  }

  async updateCourse(
    id: string,
    data: Prisma.CourseUpdateInput,
  ): Promise<Course> {
    return this.prisma.course.update({
      where: { id },
      data,
      include: {
        price: true,
        subjects: true,
        works: true,
      },
    });
  }

  async deleteCourse(id: string): Promise<Course> {
    return this.prisma.course.delete({
      where: { id },
      include: {
        price: true,
        subjects: true,
        works: true,
      },
    });
  }
}
