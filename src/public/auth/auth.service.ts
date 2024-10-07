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
    const user = await this.prismaService.user.findFirst({
      where: { email },
    });

    if (!user) {
      throw new NotFoundException('User with this email not found');
    }

    if (user.password !== password) {
      throw new UnauthorizedException('Invalid password');
    }

    return this.createToken(user);
  }

  async forgotPassword() {
    return { message: 'Password reset link sent' };
  }

  async resetPassword() {
    return { message: 'Password successfully reset' };
  }
}
