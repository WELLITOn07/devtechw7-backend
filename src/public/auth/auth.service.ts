import {
  Injectable,
  UnauthorizedException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private readonly prismaService: PrismaService,
  ) {}

  async createToken(user: User) {
    const payload = {
      username: user.name,
      email: user.email,
      sub: user.id,
      role: user.role,
      apps: user.apps,
    };

    return {
      ...payload,
      access_token: this.jwtService.sign(payload),
    };
  }

  async validateToken(token: string) {
    try {
      return this.jwtService.verify(token);
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }

  async login(email: string, password: string) {
    const user = await this.prismaService.user.findUnique({
      where: { email, password },
    });

    if (!user) {
      throw new UnauthorizedException('Email or password incorrect');
    }

    return this.createToken(user);
  }

  async forgotPassword(email: string) {
    const user = await this.prismaService.user.findUnique({
      where: { email: email },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return true;
  }

  async resetPassword(email: string, newPassword: string) {
    if (newPassword.length < 6) {
      throw new BadRequestException('Password must be at least 6 characters');
    }

    const userToUpdate = await this.prismaService.user.findUnique({
      where: { email },
    });

    if (!userToUpdate) {
      throw new NotFoundException('User not found');
    }

    return await this.prismaService.user.update({
      where: { email },
      data: { password: newPassword },
    });
  }
}
