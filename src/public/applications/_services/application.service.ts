import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class ApplicationService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.application.findMany();
  }

  async findOne(id: number) {
    const application = await this.prisma.application.findUnique({
      where: { id },
    });
    if (!application) {
      throw new NotFoundException(`Application with ID ${id} not found`);
    }
    return application;
  }

  async create(data: Prisma.ApplicationCreateInput) {
    return this.prisma.application.create({ data });
  }

  async upsertBulk(data: Prisma.ApplicationCreateInput[]) {
    if (!Array.isArray(data) || data.length === 0) {
      throw new Error('Invalid input: Data should be a non-empty array.');
    }

    for (const app of data) {
      await this.prisma.application.upsert({
        where: { name: app.name },
        update: app,
        create: app,
      });
    }
  }

  async update(id: number, data: Prisma.ApplicationUpdateInput) {
    await this.findOne(id);
    return this.prisma.application.update({
      where: { id },
      data,
    });
  }

  async delete(id: number) {
    await this.findOne(id);
    return this.prisma.application.delete({ where: { id } });
  }
}