import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { BiomedsandraApiModule } from './biomedsandra-api/biomedsandra-api.module';
import { join } from 'path';
import { UserModule } from './public/user/user.module';
import { AuthModule } from './public/auth/auth.module';
import { AppController } from './app.controller';
import { AccessRuleModule } from './public/access-rule/access-rule.module';
import { ApplicationModule } from './public/applications/application.module';
import { AnalyticsEventModule } from './public/analytics/analytics-event.module';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { MailerModule } from '@nestjs-modules/mailer';
import { AdvertisingModule } from './public/advertising/advertising.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath:
        process.env.NODE_ENV === 'production'
          ? '.env.production'
          : '.env.development',
    }),
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 100,
        ignoreUserAgents: [/Googlebot/],
      },
    ]),
    MailerModule.forRoot({
      transport: {
        host: 'smtp.sendgrid.net',
        port: 587,
        secure: false,
        auth: {
          user: 'apikey',
          pass: process.env.SENDGRID_API_KEY,
        },
      },
      defaults: {
        from: `"No Reply" <${process.env.BIOMEDSANDRA_EMAIL}>`,
      },
      template: {
        dir: join(__dirname, 'templates'),
        adapter: new HandlebarsAdapter(),
        options: {
          strict: true,
        },
      },
    }),
    AuthModule,
    UserModule,
    BiomedsandraApiModule,
    AccessRuleModule,
    ApplicationModule,
    AnalyticsEventModule,
    AdvertisingModule,
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
