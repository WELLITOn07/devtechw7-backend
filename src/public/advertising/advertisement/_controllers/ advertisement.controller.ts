import { Controller, Post, Body, Get, Inject } from '@nestjs/common';
import { CreateAdvertisementDto } from '../_dto/create-advertisement.dto';
import { AdvertisementService } from '../_services/advertisement.service';
import { ParamNumberId } from 'src/public/_decorators/param-number-id.decorator';
import { EmailService } from 'src/public/_services/email/email.service';

@Controller('advertisements')
export class AdvertisementController {
  constructor(
    private readonly advertisementService: AdvertisementService,
    private readonly emailService: EmailService,
  ) {}

  @Post()
  async create(@Body() createAdvertisementDto: CreateAdvertisementDto) {
    return this.advertisementService.create(createAdvertisementDto);
  }

  @Get(':id')
  async findByApplication(@ParamNumberId() applicationId: number) {
    return this.advertisementService.findByApplication(applicationId);
  }

  @Post('send/:id')
  async sendWelcome(@Body('to') to: string) {
    await this.emailService.sendWelcomeEmail(to);
    return 'E-mail enviado com sucesso!';
  }
}
