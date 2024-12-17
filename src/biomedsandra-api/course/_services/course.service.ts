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

  async updateCourse(id: string, data: any): Promise<Course> {
    const existingCourse = await this.getCourseById(id);

    if (!existingCourse) {
      throw new NotFoundException(`Course with ID ${id} not found`);
    }

    const formattedSubjects = data.subjects.map((subject: any) => ({
      id: subject.id || undefined, // Retain existing ID or allow creation
      category: subject.category,
      topics: { set: subject.topics },
    }));

    const formattedWorks = data.works.map((work: any) => ({
      id: work.id || undefined, // Retain existing ID or allow creation
      title: work.title,
      url: work.url,
    }));

    return this.prisma.course.update({
      where: { id },
      data: {
        title: data.title,
        description: data.description,
        cover: data.cover,
        link: data.link,
        type: data.type,
        price: {
          update: {
            original: data.price.original,
            discounted: data.price.discounted,
          },
        },
        subjects: {
          deleteMany: {}, // Clear existing subjects
          create: formattedSubjects, // Re-add updated subjects
        },
        works: {
          deleteMany: {}, // Clear existing works
          create: formattedWorks, // Re-add updated works
        },
      },
      include: {
        price: true,
        subjects: true,
        works: true,
      },
    });
  }

  async deleteCourse(id: string): Promise<boolean> {
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
