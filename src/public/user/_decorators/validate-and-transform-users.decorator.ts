import {
  createParamDecorator,
  ExecutionContext,
  BadRequestException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';

export const ValidateAndTransformUsers = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): Prisma.UserCreateInput[] => {
    const request = ctx.switchToHttp().getRequest();
    const users: Prisma.UserCreateInput[] = request.body;

    if (!Array.isArray(users) || users.length === 0) {
      throw new BadRequestException(
        'Invalid input: Data should be a non-empty array.',
      );
    }

    return users.map((user) => {
      if (!user.email || !user.name || !user.password) {
        throw new BadRequestException(
          'Missing required fields: email, name, or password.',
        );
      }

      const formattedBirthAt =
        user.birthAt instanceof Date
          ? user.birthAt.toISOString()
          : typeof user.birthAt === 'string'
            ? new Date(user.birthAt).toISOString()
            : null;

      return {
        ...user,
        birthAt: formattedBirthAt,
      };
    });
  },
);
