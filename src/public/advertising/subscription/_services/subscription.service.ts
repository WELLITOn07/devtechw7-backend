// subscription.service.ts

import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateSubscriptionDto } from '../_dto/create-subscription.dto';

@Injectable()
export class SubscriptionService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateSubscriptionDto) {
    const existing = await this.prisma.subscription.findUnique({
      where: {
        email_applicationId: {
          email: dto.email,
          applicationId: dto.applicationId,
        },
      },
    });

    if (existing) {
      return existing;
    }

    return this.prisma.subscription.create({
      data: {
        email: dto.email,
        applicationId: dto.applicationId,
      },
    });
  }

  async findAll() {
    return this.prisma.subscription.findMany({
      include: { application: true },
    });
  }

  async remove(id: number) {
    return this.prisma.subscription.delete({
      where: { id },
    });
  }

  async findEmailsByApplication(applicationId: number) {
    const subs = await this.prisma.subscription.findMany({
      where: { applicationId },
    });
    return subs.map((s) => s.email);
  }
}
