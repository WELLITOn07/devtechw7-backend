import {
  Injectable,
  UnauthorizedException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User, Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserRole } from '../user/models/user-rule.enum';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private readonly prismaService: PrismaService,
  ) {}

  async createToken(user: User): Promise<{ access_token: string }> {
    const payload = {
      sub: user.id,
      username: user.name,
      email: user.email,
      role: user.role,
      apps: user.apps,
    };

    return {
      access_token: this.jwtService.sign(
        {
          ...payload,
        },
        {
          expiresIn: '7d',
          issuer: 'devtechw7-backend',
          audience: 'users',
        },
      ),
    };
  }

  async validateToken(token: string): Promise<{ [key: string]: any }> {
    try {
      return this.jwtService.verify(token);
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }

  async login(
    email: string,
    password: string,
  ): Promise<{ access_token: string }> {
    const user = await this.prismaService.user.findUnique({
      where: { email, password },
    });

    if (!user) {
      throw new UnauthorizedException('Email or password incorrect');
    }

    return this.createToken(user);
  }

  async registerUser(data: User): Promise<{ access_token: string }> {
    const userWithSameEmail = await this.prismaService.user.findUnique({
      where: { email: data.email },
    });

    if (userWithSameEmail) {
      return null;
    }

    this.prismaService.user.create({
      data: {
        ...data,
        role: data.role ?? UserRole.COMMON,
      },
    });

    return this.createToken(data);
  }

  async forgotPassword(email: string): Promise<boolean> {
    const user = await this.prismaService.user.findUnique({
      where: { email: email },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return true;
  }

  async resetPassword(
    email: string,
    newPassword: string,
  ): Promise<{ access_token: string }> {
    if (newPassword.length < 6) {
      throw new BadRequestException('Password must be at least 6 characters');
    }

    const userToUpdate = await this.prismaService.user.findUnique({
      where: { email },
    });

    if (!userToUpdate) {
      throw new NotFoundException('User not found');
    }

    await this.prismaService.user.update({
      where: { email },
      data: { password: newPassword },
    });

    return this.createToken(userToUpdate);
  }
}
