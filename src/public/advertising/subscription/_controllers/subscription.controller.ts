import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { SubscriptionService } from '../_services/subscription.service';
import { CreateSubscriptionDto } from '../_dto/create-subscription.dto';

@Controller('subscriptions')
export class SubscriptionController {
  constructor(private readonly subscriptionService: SubscriptionService) {}

  @Post()
  async create(@Body() createSubscriptionDto: CreateSubscriptionDto) {
    return this.subscriptionService.create(createSubscriptionDto);
  }

  @Get()
  async findAll() {
    return this.subscriptionService.findAll();
  }

  @Get('application/:id')
  async findByApplication(@Param('id') applicationId: number) {
    return this.subscriptionService.findEmailsByApplication(Number(applicationId));
  }

  @Delete(':id')
  async remove(@Param('id') id: number) {
    return this.subscriptionService.remove(Number(id));
  }

  @Get('email')
  async findByEmail(@Query('email') email: string) {
    return this.subscriptionService.findByEmail(email);
  }
}
