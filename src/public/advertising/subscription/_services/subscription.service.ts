import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateSubscriptionDto } from '../_dto/create-subscription.dto';

@Injectable()
export class SubscriptionService {
  constructor(private readonly prisma: PrismaService) {}
  async create(dto: CreateSubscriptionDto) {
    const { email, applicationIds } = dto;

    const existingSubscription = await this.prisma.subscription.findUnique({
      where: { email },
    });

    if (existingSubscription) {
      const updatedApplicationIds = Array.from(
        new Set([...existingSubscription.applicationIds, ...applicationIds]),
      );

      return this.prisma.subscription.update({
        where: { email },
        data: { applicationIds: updatedApplicationIds },
      });
    }

    return this.prisma.subscription.create({
      data: {
        email,
        applicationIds,
      },
    });
  }


  async findAll() {
    return this.prisma.subscription.findMany();
  }

  async remove(id: number) {
    return this.prisma.subscription.delete({
      where: { id },
    });
  }

  async findEmailsByApplication(applicationId: number) {
    const subscriptions = await this.prisma.subscription.findMany({
      where: { applicationIds: { has: applicationId } },
    });

    return subscriptions.map((sub) => sub.email);
  }

  async findByEmail(email: string) {
    return this.prisma.subscription.findUnique({
      where: { email },
    });
  }
}
