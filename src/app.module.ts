import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { BiomedsandraApiModule } from './biomedsandra-api/biomedsandra-api.module';
import { UserModule } from './public/user/user.module';
import { AuthModule } from './public/auth/auth.module';
import { AppController } from './app.controller';
import { AccessRuleModule } from './public/access-rule/access-rule.module';
import { ApplicationModule } from './public/applications/application.module';

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
    AuthModule,
    UserModule,
    BiomedsandraApiModule,
    AccessRuleModule,
    ApplicationModule,
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
