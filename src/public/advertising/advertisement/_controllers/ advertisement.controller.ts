import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { CreateAdvertisementDto } from '../_dto/create-advertisement.dto';
import { AdvertisementService } from '../_services/advertisement.service';
import { ParamNumberId } from 'src/public/_decorators/param-number-id.decorator';

@Controller('advertisements')
export class AdvertisementController {
  constructor(private readonly advertisementService: AdvertisementService) {}

  @Post()
  async create(@Body() createAdvertisementDto: CreateAdvertisementDto) {
    return this.advertisementService.create(createAdvertisementDto);
  }

  @Get(':id')
  async findByApplication(@ParamNumberId() applicationId: number) {
    return this.advertisementService.findByApplication(applicationId);
  }
}
