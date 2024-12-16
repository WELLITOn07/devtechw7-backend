import { Module } from '@nestjs/common';
import { AnalyticsEventController } from './_controllers/analytics-event.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { AnalyticsEventService } from './_services/analytics-event.service';

@Module({
  controllers: [AnalyticsEventController],
  providers: [AnalyticsEventService, PrismaService],
})
export class AnalyticsEventModule {}
