import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AccessRuleService {
  constructor(private readonly prisma: PrismaService) {}

  async validateAccess(urlOrigin: string, userId: number): Promise<void> {
    const accessRule = await this.prisma.accessRule.findFirst({
      where: { urlOrigin },
    });

    if (!accessRule) {
      throw new UnauthorizedException(
        `Access rule for URL ${urlOrigin} was not found.`,
      );
    }

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new UnauthorizedException('User not found.');
    }

    const isRoleAllowed = accessRule.allowedRoles.some((role) =>
      user.rule.includes(role),
    );

    if (!isRoleAllowed) {
      throw new UnauthorizedException(
        `Your role does not allow access to the application hosted at ${urlOrigin}.`,
      );
    }
  }
}