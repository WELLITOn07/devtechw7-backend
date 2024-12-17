// advertisement.controller.ts

import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { CreateAdvertisementDto } from '../_dto/create-advertisement.dto';
import { AdvertisementService } from '../_services/advertisement.service';
import { ParamNumberId } from 'src/public/_decorators/param-number-id.decorator';
import { EmailService } from 'src/public/_services/email/email.service';
import { SubscriptionService } from '../../subscription/_services/subscription.service';

@Controller('advertisements')
export class AdvertisementController {
  constructor(
    private readonly advertisementService: AdvertisementService,
    private readonly emailService: EmailService,
    private readonly subscriptionService: SubscriptionService,
  ) {}

  @Post()
  async create(@Body() createAdvertisementDto: CreateAdvertisementDto) {
    return this.advertisementService.create(createAdvertisementDto);
  }

  @Get()
  async findAll() {
    return this.advertisementService.findAll();
  }

  @Get('application/:id')
  async findByApplication(@ParamNumberId() applicationId: number) {
    return this.advertisementService.findByApplication(applicationId);
  }

  @Post('send/:applicationId')
  async sendAdvertisement(
    @ParamNumberId() applicationId: number,
    @Body('advertisementId') advertisementId: number,
  ) {
    const emails =
      await this.subscriptionService.findEmailsByApplication(applicationId);
    const ad = await this.advertisementService.findOne(advertisementId);

    for (const email of emails) {
      await this.emailService.sendAdvertisementEmail(email, {
        title: ad.title,
        description: ad.description,
        link: ad.link,
        image: ad.image,
      });
    }

    return { message: 'E-mails enviados com sucesso!' };
  }

  @Post('send/welcome')
  async sendWelcome(@Body('to') to: string) {
    await this.emailService.sendWelcomeEmail(to);
    return 'E-mail enviado com sucesso!';
  }
}