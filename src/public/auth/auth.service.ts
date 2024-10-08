import {
  Injectable,
  UnauthorizedException,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
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
      access_token: await this.jwtService.sign(
        { ...payload },
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
      return await this.jwtService.verify(token);
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }

  async login(
    email: string,
    password: string,
  ): Promise<{ access_token: string; user: User }> {
    const user = await this.prismaService.user.findFirst({
      where: { email, password },
    });

    if (!user) {
      throw new UnauthorizedException('Email or password incorrect');
    }

    const token = await this.createToken(user);
    return { access_token: token.access_token, user };
  }

  async registerUser(
    data: User,
  ): Promise<{ message: string; access_token: string }> {
    const userWithSameEmail = await this.prismaService.user.findFirst({
      where: { email: data.email },
    });

    if (userWithSameEmail) {
      throw new ConflictException(
        `User with email ${data.email} already exists`,
      );
    }

    const userCreated = await this.prismaService.user.create({
      data: { ...data, role: data.role ?? UserRole.COMMON },
    });

    const token = await this.createToken(userCreated);
    return {
      message: 'User created successfully',
      access_token: token.access_token,
    };
  }

  async forgotPassword(email: string): Promise<{ message: string }> {
    const user = await this.prismaService.user.findFirst({ where: { email } });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return { message: 'Password reset link sent' };
  }

  async resetPassword(
    email: string,
    newPassword: string,
  ): Promise<{ message: string; access_token: string }> {
    if (newPassword.length < 6) {
      throw new BadRequestException('Password must be at least 6 characters');
    }

    const userToUpdate = await this.prismaService.user.findFirst({
      where: { email },
    });

    if (!userToUpdate) {
      throw new NotFoundException('User not found');
    }

    await this.prismaService.user.update({
      where: { email },
      data: { password: newPassword },
    });

    const token = await this.createToken(userToUpdate);
    return {
      message: 'Password successfully reset',
      access_token: token.access_token,
    };
  }
}
