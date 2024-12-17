import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  UseGuards,
  HttpStatus,
  NotFoundException,
} from '@nestjs/common';
import { CreateAdvertisementDto } from '../_dto/create-advertisement.dto';
import { AdvertisementService } from '../_services/advertisement.service';
import { EmailService } from 'src/public/_services/email/email.service';
import { SubscriptionService } from '../../subscription/_services/subscription.service';
import { ParamNumberId } from 'src/public/_decorators/param-number-id.decorator';
import { AuthGuard } from 'src/public/auth/_guards/auth.guard';
import { RuleAccessGuard } from 'src/public/auth/_guards/rule-access.guard';
import { RuleAccess } from 'src/public/_decorators/rule-access.decorator';
import { RuleAccessEnum } from 'src/public/_enums/rule-access.enum';

@Controller('advertisements')
export class AdvertisementController {
  constructor(
    private readonly advertisementService: AdvertisementService,
    private readonly emailService: EmailService,
    private readonly subscriptionService: SubscriptionService,
  ) {}

  @RuleAccess(RuleAccessEnum.ADMIN, RuleAccessEnum.MODERATOR)
  @UseGuards(AuthGuard, RuleAccessGuard)
  @Post()
  async create(@Body() createAdvertisementDto: CreateAdvertisementDto) {
    try {
      const ad = await this.advertisementService.create(createAdvertisementDto);
      return {
        statusCode: HttpStatus.CREATED,
        message: 'Advertisement created successfully',
        data: ad,
      };
    } catch (error) {
      throw new NotFoundException(
        `Failed to create advertisement: ${error.message}`,
      );
    }
  }

  @RuleAccess(RuleAccessEnum.ADMIN, RuleAccessEnum.MODERATOR)
  @UseGuards(AuthGuard, RuleAccessGuard)
  @Get()
  async findAll() {
    try {
      const ads = await this.advertisementService.findAll();
      return {
        statusCode: HttpStatus.OK,
        message: 'Advertisements retrieved successfully',
        data: ads,
      };
    } catch (error) {
      throw new NotFoundException(
        `Failed to retrieve advertisements: ${error.message}`,
      );
    }
  }

  @RuleAccess(RuleAccessEnum.ADMIN, RuleAccessEnum.MODERATOR)
  @UseGuards(AuthGuard, RuleAccessGuard)
  @Get(':id')
  async findOne(@ParamNumberId('id') id: number) {
    try {
      const ad = await this.advertisementService.findOne(id);
      if (!ad) {
        throw new NotFoundException(`Advertisement with ID ${id} not found`);
      }
      return {
        statusCode: HttpStatus.OK,
        message: `Advertisement with ID ${id} retrieved successfully`,
        data: ad,
      };
    } catch (error) {
      throw new NotFoundException(
        `Failed to retrieve advertisement: ${error.message}`,
      );
    }
  }

  @RuleAccess(RuleAccessEnum.ADMIN, RuleAccessEnum.MODERATOR)
  @UseGuards(AuthGuard, RuleAccessGuard)
  @Post('send/:id')
  async sendAdvertisement(
    @ParamNumberId('id') applicationId: number,
    @Body('advertisementId') advertisementId: number,
  ) {
    try {
      const emails =
        await this.subscriptionService.findEmailsByApplication(applicationId);

      const ad = await this.advertisementService.findOne(advertisementId);

      if (!ad) {
        throw new NotFoundException(
          `Advertisement with ID ${advertisementId} not found`,
        );
      }

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

      return {
        statusCode: HttpStatus.OK,
        message: 'E-mails sent successfully',
      };
    } catch (error) {
      throw new NotFoundException(`Failed to send emails: ${error.message}`);
    }
  }

  @Post('send/welcome')
  async sendWelcome(@Body('to') to: string) {
    try {
      await this.emailService.sendWelcomeEmail(to);
      return {
        statusCode: HttpStatus.OK,
        message: 'Welcome email sent successfully',
      };
    } catch (error) {
      throw new NotFoundException(
        `Failed to send welcome email: ${error.message}`,
      );
    }
  }
}
