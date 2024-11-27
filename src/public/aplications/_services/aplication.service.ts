import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ApplicationService {
  constructor(private readonly prisma: PrismaService) {}

  async validateAccess(urlOrigin: string, userId: number): Promise<void> {
    const application = await this.prisma.application.findFirst({
      where: { urlOrigin },
    });

    if (!application) {
      throw new UnauthorizedException(
        `Application associated with URL ${urlOrigin} was not found.`,
      );
    }

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new UnauthorizedException('User not found.');
    }

    const isRoleAllowed = application.allowedRoles.some((role) =>
      user.rule.includes(role),
    );

    if (!isRoleAllowed) {
      throw new UnauthorizedException(
        `Your role does not allow access to the application hosted at ${urlOrigin}.`,
      );
    }
  }
}
