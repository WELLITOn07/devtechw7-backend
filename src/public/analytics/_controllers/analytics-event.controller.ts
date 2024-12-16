import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { CreateAnalyticsEventDto } from '../_dto/analytics-event.dto';
import { AnalyticsEventService } from '../_services/analytics-event.service';

@Controller('analytics-events')
export class AnalyticsEventController {
  constructor(private readonly analyticsEventsService: AnalyticsEventService) {}
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async upsertEvent(@Body() dto: CreateAnalyticsEventDto) {
    return await this.analyticsEventsService.upsertEvent(dto);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll() {
    return this.analyticsEventsService.findAll();
  }

  @Get('application/:application')
  @HttpCode(HttpStatus.OK)
  async findByApplication(@Param('application') application: string) {
    return this.analyticsEventsService.findByApplication(application);
  }

  @Delete()
  @HttpCode(HttpStatus.OK)
  async deleteEvent(
    @Query('application') application: string,
    @Query('eventType') eventType: string,
    @Query('eventName') eventName: string,
  ) {
    return this.analyticsEventsService.deleteEvent(
      application,
      eventType,
      eventName,
    );
  }
}