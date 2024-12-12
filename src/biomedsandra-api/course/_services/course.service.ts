import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma, Course } from '@prisma/client';

@Injectable()
export class CourseService {
  constructor(private prisma: PrismaService) {}

  async createCourse(data: any): Promise<Course> {
    const formattedSubjects = data.subjects.map((subject: any) => ({
      category: subject.category,
      topics: { set: subject.topics },
    }));

    const formattedWorks = data.works.map((work: any) => ({
      title: work.title,
      url: work.url,
    }));

    return this.prisma.course.create({
      data: {
        id: data.id,
        title: data.title,
        description: data.description,
        cover: data.cover,
        link: data.link,
        type: data.type,
        price: {
          create: {
            original: data.price.original,
            discounted: data.price.discounted,
          },
        },
        subjects: {
          create: formattedSubjects,
        },
        works: {
          create: formattedWorks,
        },
      },
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
      data: {
        ...data,
        price: data.price,
        subjects: data.subjects,
        works: data.works,
      },
      include: {
        price: true,
        subjects: true,
        works: true,
      },
    });
  }

  async deleteCourse(id: string): Promise<Boolean> {
    try {
      const course = await this.prisma.course.findUnique({
        where: { id },
        include: { price: true },
      });

      await this.prisma.subject.deleteMany({
        where: { courseId: course.id },
      });

      await this.prisma.work.deleteMany({
        where: { courseId: course.id },
      });

      if (!course) {
        throw new Error(`Course with ID ${id} not found`);
      }

      if (course.priceId) {
        await this.prisma.price.delete({
          where: { id: course.priceId },
        });
      }

      return true;
    } catch (error) {
      console.error(`Failed to delete course with ID ${id}:`, error);
      throw new Error(`Failed to delete course with ID ${id}`);
    }
  }
}
