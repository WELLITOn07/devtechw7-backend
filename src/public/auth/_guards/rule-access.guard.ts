import { Injectable } from '@nestjs/common';
import { CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RuleAccessEnum } from 'src/public/_enums/rule-access.enum';
@Injectable()
export class RuleAccessGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();

    if (!request.user) {
      return false;
    }

    const rule = this.reflector.getAllAndOverride<RuleAccessEnum>('rules', [
      context.getHandler(),
      context.getClass(),
    ]);
    
    if (!rule) {
      return true;
    }

    const userRules = request.user.rule;
    const hasAccess = userRules.some((userRule: string) => rule.includes(userRule));

    return hasAccess;
  }
}
