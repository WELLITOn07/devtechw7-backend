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
  UseGuards,
} from '@nestjs/common';
import { CreateAnalyticsEventDto } from '../_dto/analytics-event.dto';
import { AnalyticsEventService } from '../_services/analytics-event.service';
import { RuleAccess } from 'src/public/_decorators/rule-access.decorator';
import { AuthGuard } from 'src/public/auth/_guards/auth.guard';
import { RuleAccessGuard } from 'src/public/auth/_guards/rule-access.guard';
import { RuleAccessEnum } from 'src/public/_enums/rule-access.enum';

@Controller('analytics-events')
export class AnalyticsEventController {
  constructor(private readonly analyticsEventsService: AnalyticsEventService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async upsertEvent(@Body() dto: CreateAnalyticsEventDto) {
    return await this.analyticsEventsService.upsertEvent(dto);
  }

  @RuleAccess(RuleAccessEnum.ADMIN, RuleAccessEnum.MODERATOR)
  @UseGuards(AuthGuard, RuleAccessGuard)
  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll() {
    return this.analyticsEventsService.findAll();
  }

  @RuleAccess(RuleAccessEnum.ADMIN, RuleAccessEnum.MODERATOR)
  @UseGuards(AuthGuard, RuleAccessGuard)
  @Get('application/:application')
  @HttpCode(HttpStatus.OK)
  async findByApplication(@Param('application') application: string) {
    return this.analyticsEventsService.findByApplication(application);
  }

  @RuleAccess(RuleAccessEnum.ADMIN)
  @UseGuards(AuthGuard, RuleAccessGuard)
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
