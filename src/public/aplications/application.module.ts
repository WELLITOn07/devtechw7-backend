import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthGuard } from 'src/public/auth/_guards/auth.guard';
import { RuleAccessGuard } from 'src/public/auth/_guards/rule-access.guard';
import { ApplicationController } from './_controllers/application.controller';
import { ApplicationService } from './_services/application.service';

@Module({
  controllers: [ApplicationController],
  providers: [
    ApplicationService,
    PrismaService,
    AuthGuard,
    RuleAccessGuard, 
  ],
  exports: [ApplicationService], 
})
export class ApplicationModule {}
