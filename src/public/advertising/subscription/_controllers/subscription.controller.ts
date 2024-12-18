import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Delete,
  Query,
  HttpCode,
  HttpStatus,
  NotFoundException,
  UseGuards,
} from '@nestjs/common';
import { SubscriptionService } from '../_services/subscription.service';
import { CreateSubscriptionDto } from '../_dto/create-subscription.dto';
import { RuleAccessGuard } from 'src/public/auth/_guards/rule-access.guard';
import { AuthGuard } from 'src/public/auth/_guards/auth.guard';
import { RuleAccess } from 'src/public/_decorators/rule-access.decorator';
import { RuleAccessEnum } from 'src/public/_enums/rule-access.enum';

@Controller('subscriptions')
export class SubscriptionController {
  constructor(private readonly subscriptionService: SubscriptionService) {}

  @UseGuards(AuthGuard, RuleAccessGuard)
  @RuleAccess(RuleAccessEnum.ADMIN, RuleAccessEnum.MODERATOR)
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createSubscriptionDto: CreateSubscriptionDto) {
    try {
      const subscription = await this.subscriptionService.create(
        createSubscriptionDto,
      );
      return {
        statusCode: HttpStatus.CREATED,
        message: 'Subscription created successfully',
        data: subscription,
      };
    } catch (error) {
      throw new NotFoundException(
        `Failed to create subscription: ${error.message}`,
      );
    }
  }

  @UseGuards(AuthGuard, RuleAccessGuard)
  @RuleAccess(RuleAccessEnum.ADMIN, RuleAccessEnum.MODERATOR)
  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll() {
    try {
      const subscriptions = await this.subscriptionService.findAll();
      return {
        statusCode: HttpStatus.OK,
        message: 'Subscriptions retrieved successfully',
        data: subscriptions,
      };
    } catch (error) {
      throw new NotFoundException(
        `Failed to retrieve subscriptions: ${error.message}`,
      );
    }
  }

  @UseGuards(AuthGuard, RuleAccessGuard)
  @RuleAccess(RuleAccessEnum.ADMIN, RuleAccessEnum.MODERATOR)
  @Get('application/:id')
  @HttpCode(HttpStatus.OK)
  async findByApplication(@Param('id') applicationId: number) {
    try {
      const emails =
        await this.subscriptionService.findEmailsByApplication(applicationId);
      return {
        statusCode: HttpStatus.OK,
        message: `Emails for application ID ${applicationId} retrieved successfully`,
        data: emails,
      };
    } catch (error) {
      throw new NotFoundException(
        `Failed to retrieve emails for application ID ${applicationId}: ${error.message}`,
      );
    }
  }

  @UseGuards(AuthGuard, RuleAccessGuard)
  @RuleAccess(RuleAccessEnum.ADMIN, RuleAccessEnum.MODERATOR)
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: number) {
    try {
      const deletedSubscription = await this.subscriptionService.remove(id);
      if (!deletedSubscription) {
        throw new NotFoundException(`Subscription with ID ${id} not found`);
      }
    } catch (error) {
      throw new NotFoundException(
        `Failed to delete subscription: ${error.message}`,
      );
    }
  }

  @UseGuards(AuthGuard, RuleAccessGuard)
  @RuleAccess(RuleAccessEnum.ADMIN, RuleAccessEnum.MODERATOR)
  @Get('email')
  @HttpCode(HttpStatus.OK)
  async findByEmail(@Query('email') email: string) {
    try {
      const subscription = await this.subscriptionService.findByEmail(email);
      if (!subscription) {
        throw new NotFoundException(
          `Subscription with email ${email} not found`,
        );
      }
      return {
        statusCode: HttpStatus.OK,
        message: `Subscription with email ${email} retrieved successfully`,
        data: subscription,
      };
    } catch (error) {
      throw new NotFoundException(
        `Failed to retrieve subscription: ${error.message}`,
      );
    }
  }
}

