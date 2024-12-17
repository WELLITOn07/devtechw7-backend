import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { CreateAdvertisementDto } from '../_dto/create-advertisement.dto';
import { AdvertisementService } from '../_services/advertisement.service';
import { EmailService } from 'src/public/_services/email/email.service';
import { SubscriptionService } from '../../subscription/_services/subscription.service';
import { ParamNumberId } from 'src/public/_decorators/param-number-id.decorator';

@Controller('advertisements')
export class AdvertisementController {
  constructor(
    private readonly advertisementService: AdvertisementService,
    private readonly emailService: EmailService,
    private readonly subscriptionService: SubscriptionService,
  ) {}

  // Criação de anúncios
  @Post()
  async create(@Body() createAdvertisementDto: CreateAdvertisementDto) {
    return this.advertisementService.create(createAdvertisementDto);
  }

  // Buscar todos os anúncios
  @Get()
  async findAll() {
    return this.advertisementService.findAll();
  }

  // Buscar um anúncio específico pelo ID
  @Get(':id')
  async findOne(@ParamNumberId('id') id: number) {
    return this.advertisementService.findOne(id);
  }

  @Post('send/:id')
  async sendAdvertisement(
    @ParamNumberId('id') applicationId: number,
    @Body('advertisementId') advertisementId: number,
  ) {
    console.log('applicationId:', applicationId);
    console.log('advertisementId:', advertisementId);

    const emails =
      await this.subscriptionService.findEmailsByApplication(applicationId);

    const ad = await this.advertisementService.findOne(advertisementId);

    await Promise.all(
      emails.map((email) =>
        this.emailService.sendAdvertisementEmail(email, {
          title: ad.title,
          description: ad.description,
          link: ad.link,
          image: ad.image,
        }),
      ),
    );

    return { message: 'E-mails enviados com sucesso!' };
  }

  // Envio de boas-vindas (teste)
  @Post('send/welcome')
  async sendWelcome(@Body('to') to: string) {
    await this.emailService.sendWelcomeEmail(to);
    return 'E-mail enviado com sucesso!';
  }
}
