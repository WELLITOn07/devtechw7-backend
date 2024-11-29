import { forwardRef, Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AccessRuleService } from './_services/access-rule.service';
import { AccessRuleController } from './_controllers/access-rule.controller';
import { AuthGuard } from '../auth/_guards/auth.guard';
import { RuleAccessGuard } from '../auth/_guards/rule-access.guard';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [forwardRef(() => AuthModule)],
  controllers: [AccessRuleController],
  providers: [AccessRuleService, PrismaService, AuthGuard, RuleAccessGuard],
  exports: [AccessRuleService],
})
export class AccessRuleModule {}
