import { SetMetadata } from '@nestjs/common';
import { RuleAccessEnum } from '../_enums/rule-access.enum';

export const RuleAccess = (...ruleAccess: RuleAccessEnum[]) =>
  SetMetadata('rules', ruleAccess);
