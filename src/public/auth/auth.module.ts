import { forwardRef, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { UserModule } from '../user/user.module';
import { PrismaModule } from 'src/prisma/prisma.module';
import { AuthService } from './auth.service';
import { AuthGuard } from './_guards/auth.guard';
import { AccessRuleModule } from '../access-rule/access-rule.module';
import { AnalyticsEventModule } from '../analytics/analytics-event.module';
import { AdvertisingModule } from '../advertising/advertising.module';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1d' },
    }),
    forwardRef(() => UserModule),
    forwardRef(() => AccessRuleModule),
    forwardRef(() => AnalyticsEventModule),
    forwardRef(() => AdvertisingModule),
    PrismaModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, AuthGuard],
  exports: [AuthService],
})
export class AuthModule {}
