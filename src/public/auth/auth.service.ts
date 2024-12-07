import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { AccessRuleService } from '../access-rule/_services/access-rule.service';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private readonly prismaService: PrismaService,
    private readonly accessRuleService: AccessRuleService,
  ) {}

  private createToken(user: {
    id: number;
    name: string;
    email: string;
    rule: string[];
  }): { access_token: string } {
    const payload = {
      sub: user.id,
      username: user.name,
      email: user.email,
      rule: user.rule,
    };

    return {
      access_token: this.jwtService.sign(payload, {
        expiresIn: '7d',
        issuer: 'devtechw7-backend',
        audience: 'users',
      }),
    };
  }

  validateToken(token: string) {
    try {
      return this.jwtService.verify(token);
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }

  encryptPassword(password: string): string {
    return bcrypt.hashSync(password, 5);
  }

  private decryptPassword(hash: string, password: string): boolean {
    return bcrypt.compareSync(password, hash);
  }

  async login(
    email: string,
    password: string,
    urlOrigin: string,
  ): Promise<{ access_token: string; user: any }> {
    const user = await this.prismaService.user.findFirst({
      where: { email },
      select: {
        id: true,
        name: true,
        email: true,
        password: true,
        rule: true,
      },
    });

    if (!user) {
      throw new UnauthorizedException('Email or password incorrect');
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      throw new UnauthorizedException('Email or password incorrect');
    }

    await this.accessRuleService.validateAccess(urlOrigin, user.id);

    const token = this.createToken({
      id: user.id,
      name: user.name,
      email: user.email,
      rule: user.rule,
    });

    const { password: _, ...userWithoutPassword } = user;
    return { access_token: token.access_token, user: userWithoutPassword };
  }

  async registerUser(data: {
    name: string;
    email: string;
    password: string;
    birthAt?: Date;
  }): Promise<{ message: string; access_token: string }> {
    const userWithSameEmail = await this.prismaService.user.findFirst({
      where: { email: data.email },
    });

    if (userWithSameEmail) {
      throw new ConflictException(
        `User with email ${data.email} already exists`,
      );
    }

    data.password = this.encryptPassword(data.password);

    const userCreated = await this.prismaService.user.create({
      data: {
        email: data.email,
        name: data.name,
        password: data.password,
        rule: ['COMMON'],
        birthAt: data.birthAt || new Date(),
      },
    });

    const token = this.createToken({
      id: userCreated.id,
      name: userCreated.name,
      email: userCreated.email,
      rule: userCreated.rule,
    });

    return {
      message: 'User created successfully',
      access_token: token.access_token,
    };
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

    const isValid = this.decryptPassword(userToUpdate.password, newPassword);

    if (isValid) {
      throw new BadRequestException('New password must be different');
    }

    await this.prismaService.user.update({
      where: { email },
      data: { password: this.encryptPassword(newPassword) },
    });

    const token = this.createToken({
      id: userToUpdate.id,
      name: userToUpdate.name,
      email: userToUpdate.email,
      rule: userToUpdate.rule,
    });

    return {
      message: 'Password successfully reset',
      access_token: token.access_token,
    };
  }

  async forgotPassword(email: string): Promise<{ message: string }> {
    const user = await this.prismaService.user.findFirst({
      where: { email },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return {
      message: 'Password reset email sent successfully',
    };
  }
}
