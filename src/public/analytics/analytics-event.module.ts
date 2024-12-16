import { forwardRef, Module } from '@nestjs/common';
import { AnalyticsEventController } from './_controllers/analytics-event.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { AnalyticsEventService } from './_services/analytics-event.service';
import { RuleAccessGuard } from '../auth/_guards/rule-access.guard';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [forwardRef(() => AuthModule)],
  controllers: [AnalyticsEventController],
  providers: [AnalyticsEventService, PrismaService, RuleAccessGuard],
})
export class AnalyticsEventModule {}
