import {
  createParamDecorator,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { User } from '@prisma/client';

export const userDecorator = createParamDecorator(
  (filter: string, ctx: ExecutionContext) => {
    const user: User = ctx.switchToHttp().getRequest().user;

    if (!user) {
      throw new ForbiddenException('User not found');
    }

    if (filter) {
      return user[filter];
    }

    return user;
  },
);
