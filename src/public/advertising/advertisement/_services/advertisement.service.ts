import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateAdvertisementDto } from '../_dto/create-advertisement.dto';
@Injectable()
export class AdvertisementService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateAdvertisementDto) {
    return this.prisma.advertisement.create({
      data: {
        title: dto.title,
        description: dto.description,
        link: dto.link,
        image: Buffer.from(dto.image, 'base64'),
        applicationId: dto.applicationId,
      },
    });
  }

  async findByApplication(applicationId: number) {
    const advertisements = await this.prisma.advertisement.findMany({
      where: { applicationId },
    });

    return advertisements.map((ad) => ({
      ...ad,
      image: ad.image.toString('base64'),
    }));
  }
}
