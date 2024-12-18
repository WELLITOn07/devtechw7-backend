import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateAdvertisementDto } from '../_dto/create-advertisement.dto';
import { UpdateAdvertisementDto } from '../_dto/update-advertisement.dto';

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
      },
    });
  }

  async findAll() {
    const advertisements = await this.prisma.advertisement.findMany();
    return advertisements.map((ad) => ({
      ...ad,
      image: ad.image ? ad.image.toString('base64') : null,
    }));
  }

  async findOne(id: number) {
    const ad = await this.prisma.advertisement.findUnique({
      where: { id },
    });
    if (!ad) throw new Error('Advertisement not found');
    return {
      ...ad,
      image: ad.image ? ad.image.toString('base64') : null,
    };
  }

  async update(id: number, dto: UpdateAdvertisementDto) {
    const existingAd = await this.prisma.advertisement.findUnique({
      where: { id },
    });

    if (!existingAd) {
      throw new NotFoundException(`Advertisement with ID ${id} not found.`);
    }

    return this.prisma.advertisement.update({
      where: { id },
      data: {
        title: dto.title,
        description: dto.description,
        link: dto.link,
        image: dto.image ? Buffer.from(dto.image, 'base64') : undefined,
      },
    });
  }

  async delete(id: number) {
    await this.prisma.advertisement.delete({
      where: { id },
    });
  }
}
