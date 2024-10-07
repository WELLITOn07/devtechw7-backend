import {
  Body,
  Controller,
  Post,
  HttpCode,
  HttpStatus,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthLoginDto } from './dto/auth-login.dto';
import { AuthForgotPasswordDto } from './dto/auth-forgot.dto';
import { AuthResetPasswordDto } from './dto/auth-reset-password.dto';
import { User } from '@prisma/client';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() data: AuthLoginDto): Promise<{ access_token: string }> {
    try {
      return await this.authService.login(data.email, data.password);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() data: User): Promise<{ message: string }> {
    try {
      const userToken = await this.authService.registerUser(data);
      if (!userToken) {
        throw new ConflictException(
          `A user with the email ${data.email} already exists`,
        );
      }
      return {
        message: `User created successfully`,
      };
    } catch (error) {
      throw new ConflictException(error.message);
    }
  }

  @Post('forgot-password')
  @HttpCode(HttpStatus.OK)
  async forgotPassword(
    @Body() data: AuthForgotPasswordDto,
  ): Promise<{ message: string }> {
    try {
      await this.authService.forgotPassword(data.email);
      return { message: 'Password reset link sent' };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Post('reset-password')
  @HttpCode(HttpStatus.OK)
  async resetPassword(
    @Body() data: AuthResetPasswordDto,
  ): Promise<{ message: string }> {
    const tokenData = await this.authService.validateToken(data.token);
    try {
      await this.authService.resetPassword(tokenData.email, data.password);
      return { message: 'Password successfully reset' };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
