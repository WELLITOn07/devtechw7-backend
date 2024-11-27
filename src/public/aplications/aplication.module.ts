import { forwardRef, Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { ApplicationService } from './_services/aplication.service';
import { ApplicationController } from './_controllers/aplication.controller';
import { AuthGuard } from '../auth/_guards/auth.guard';
import { RuleAccessGuard } from '../auth/_guards/rule-access.guard';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [forwardRef(() => AuthModule)],
  controllers: [ApplicationController],
  providers: [ApplicationService, PrismaService, AuthGuard, RuleAccessGuard],
  exports: [ApplicationService],
})
export class ApplicationModule {}
