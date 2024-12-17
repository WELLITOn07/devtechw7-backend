import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateAdvertisementDto } from '../_dto/create-advertisement.dto';

@Injectable()
export class AdvertisementService {
  constructor(private readonly prisma: PrismaService) {}

  // Criação de um anúncio
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

  // Buscar todos os anúncios
  async findAll() {
    const advertisements = await this.prisma.advertisement.findMany();
    return advertisements.map((ad) => ({
      ...ad,
      image: ad.image ? ad.image.toString('base64') : null,
    }));
  }

  // Buscar um anúncio específico pelo ID
  async findOne(advertisementId: number | string) {
    const id = Number(advertisementId); // Garantir que seja um número

    const ad = await this.prisma.advertisement.findUnique({
      where: { id },
    });

    if (!ad) {
      throw new Error('Advertisement not found');
    }

    return {
      ...ad,
      image: ad.image ? ad.image.toString('base64') : null,
    };
  }
}
