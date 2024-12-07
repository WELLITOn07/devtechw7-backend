import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ApplicationService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.application.findMany();
  }

  async findOne(id: number) {
    return this.prisma.application.findUnique({ where: { id } });
  }

  async create(data: any) {
    return this.prisma.application.create({ data });
  }

  async update(id: number, data: any) {
    return this.prisma.application.update({
      where: { id },
      data,
    });
  }

  async delete(id: number) {
    return this.prisma.application.delete({ where: { id } });
  }
}