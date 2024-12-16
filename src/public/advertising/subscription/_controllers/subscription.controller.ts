import { Controller, Post, Body, Get, Param, Delete } from '@nestjs/common';
import { CreateSubscriptionDto } from '../_dto/create-subscription.dto';
import { SubscriptionService } from '../_services/subscription.service';

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

  @Delete(':id')
  async remove(@Param('id') id: number) {
    return this.subscriptionService.remove(id);
  }
}
