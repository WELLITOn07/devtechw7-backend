import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateSubscriptionDto } from '../_dto/create-subscription.dto';
@Injectable()
export class SubscriptionService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateSubscriptionDto) {
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
}
