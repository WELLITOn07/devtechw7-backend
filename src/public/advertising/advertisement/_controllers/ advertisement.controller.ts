import {
  Controller,
  Post,
  Body,
  Get,
  UseGuards,
  HttpException,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Put,
  Delete,
} from '@nestjs/common';
import { CreateAdvertisementDto } from '../_dto/create-advertisement.dto';
import { AdvertisementService } from '../_services/advertisement.service';
import { ParamNumberId } from 'src/public/_decorators/param-number-id.decorator';
import { AuthGuard } from 'src/public/auth/_guards/auth.guard';
import { RuleAccessGuard } from 'src/public/auth/_guards/rule-access.guard';
import { RuleAccess } from 'src/public/_decorators/rule-access.decorator';
import { RuleAccessEnum } from 'src/public/_enums/rule-access.enum';
import { UpdateAdvertisementDto } from '../_dto/update-advertisement.dto';
import { EmailService } from 'src/public/_services/email/email.service';
import { SubscriptionService } from '../../subscription/_services/subscription.service';

@Controller('advertisements')
export class AdvertisementController {
  constructor(
    private readonly advertisementService: AdvertisementService,
    private readonly emailService: EmailService,
    private readonly subscriptionService: SubscriptionService,
  ) {}

  @RuleAccess(RuleAccessEnum.ADMIN, RuleAccessEnum.MODERATOR)
  @UseGuards(AuthGuard, RuleAccessGuard)
  @Post('send/test')
  @HttpCode(HttpStatus.OK)
  async sendAdvertisementToSingle(
    @Body('email') recipientEmail: string,
    @Body('advertisementId') advertisementId: number,
  ) {
    try {
      const ad = await this.advertisementService.findOne(advertisementId);

      if (!ad) {
        throw new NotFoundException(
          `Advertisement with ID ${advertisementId} not found`,
        );
      }

      await this.emailService.sendAdvertisementEmail(recipientEmail, {
        title: ad.title,
        description: ad.description,
        link: ad.link,
        image: ad.image,
      });

      return {
        statusCode: HttpStatus.OK,
        message: `Advertisement sent successfully to ${recipientEmail}.`,
      };
    } catch (error) {
      throw new HttpException(
        `Failed to send advertisement: ${error.message}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @RuleAccess(RuleAccessEnum.ADMIN, RuleAccessEnum.MODERATOR)
  @UseGuards(AuthGuard, RuleAccessGuard)
  @Post('send/:id')
  @HttpCode(HttpStatus.OK)
  async sendAdvertisement(
    @ParamNumberId() id: number,
    @Body('advertisementId') advertisementId: number,
  ) {
    try {
      const emails = await this.subscriptionService.findEmailsByApplication(id);

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
        message: 'Advertisement sent successfully to all subscriptions.',
      };
    } catch (error) {
      throw new HttpException(
        `Failed to send advertisement: ${error.message}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @RuleAccess(RuleAccessEnum.ADMIN, RuleAccessEnum.MODERATOR)
  @UseGuards(AuthGuard, RuleAccessGuard)
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createAdvertisementDto: CreateAdvertisementDto) {
    try {
      const ad = await this.advertisementService.create(createAdvertisementDto);
      return {
        statusCode: HttpStatus.CREATED,
        message: 'Advertisement created successfully',
        data: ad,
      };
    } catch (error) {
      throw new HttpException(
        `Failed to create advertisement: ${error.message}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @RuleAccess(RuleAccessEnum.ADMIN, RuleAccessEnum.MODERATOR)
  @UseGuards(AuthGuard, RuleAccessGuard)
  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll() {
    try {
      const ads = await this.advertisementService.findAll();
      return {
        statusCode: HttpStatus.OK,
        message: 'Advertisements retrieved successfully',
        data: ads,
      };
    } catch (error) {
      throw new HttpException(
        `Failed to retrieve advertisements: ${error.message}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @RuleAccess(RuleAccessEnum.ADMIN, RuleAccessEnum.MODERATOR)
  @UseGuards(AuthGuard, RuleAccessGuard)
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async findOne(@ParamNumberId() id: number) {
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
      throw new HttpException(
        `Failed to retrieve advertisement: ${error.message}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @RuleAccess(RuleAccessEnum.ADMIN, RuleAccessEnum.MODERATOR)
  @UseGuards(AuthGuard, RuleAccessGuard)
  @Put(':id')
  @HttpCode(HttpStatus.OK)
  async update(
    @ParamNumberId() id: number,
    @Body() updateAdvertisementDto: UpdateAdvertisementDto,
  ) {
    try {
      const updatedAd = await this.advertisementService.update(
        id,
        updateAdvertisementDto,
      );
      return {
        statusCode: HttpStatus.OK,
        message: 'Advertisement updated successfully',
        data: updatedAd,
      };
    } catch (error) {
      throw new HttpException(
        `Failed to update advertisement: ${error.message}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @RuleAccess(RuleAccessEnum.ADMIN, RuleAccessEnum.MODERATOR)
  @UseGuards(AuthGuard, RuleAccessGuard)
  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async delete(@ParamNumberId() id: number) {
    try {
      await this.advertisementService.delete(id);
      return {
        statusCode: HttpStatus.OK,
        message: 'Advertisement deleted successfully',
      };
    } catch (error) {
      throw new HttpException(
        `Failed to delete advertisement: ${error.message}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Post('send/welcome')
  @HttpCode(HttpStatus.OK)
  async sendWelcomeEmail(@Body('email') recipientEmail: string) {
    try {
      await this.emailService.sendWelcomeEmail(recipientEmail);

      return {
        statusCode: HttpStatus.OK,
        message: `Welcome email sent successfully to ${recipientEmail}.`,
      };
    } catch (error) {
      throw new HttpException(
        `Failed to send welcome email: ${error.message}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}

