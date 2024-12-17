import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AdvertisementController } from './advertisement/_controllers/ advertisement.controller';
import { AdvertisementService } from './advertisement/_services/advertisement.service';
import { SubscriptionController } from './subscription/_controllers/subscription.controller';
import { SubscriptionService } from './subscription/_services/subscription.service';
import { EmailModule } from '../_services/email/email.module';

@Module({
  imports: [EmailModule],
  controllers: [SubscriptionController, AdvertisementController],
  providers: [
    PrismaService,
    SubscriptionService,
    AdvertisementService,
  ],
})
export class AdvertisingModule {}
