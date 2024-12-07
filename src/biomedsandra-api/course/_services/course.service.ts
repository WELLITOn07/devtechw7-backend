import { Injectable } from '@nestjs/common';
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

  async deleteCourse(id: string): Promise<Course> {
    await this.prisma.subject.deleteMany({
      where: { courseId: id },
    });

    await this.prisma.work.deleteMany({
      where: { courseId: id },
    });

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
