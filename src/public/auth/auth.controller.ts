import {
  Body,
  Headers,
  Controller,
  Post,
  HttpCode,
  HttpStatus,
  BadRequestException,
  ConflictException,
  UseGuards,
  Req,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthLoginDto } from './dto/auth-login.dto';
import { AuthForgotPasswordDto } from './dto/auth-forgot.dto';
import { AuthResetPasswordDto } from './dto/auth-reset-password.dto';
import { User } from '@prisma/client';
import { AuthGuard } from './guards/auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() data: AuthLoginDto): Promise<{ access_token: string }> {
    try {
      const token = await this.authService.login(data.email, data.password);
      return { access_token: token.access_token };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(
    @Body() data: User,
  ): Promise<{ message: string; access_token: string }> {
    try {
      const userToken = await this.authService.registerUser(data);
      return userToken;
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
      return await this.authService.forgotPassword(data.email);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Post('reset-password')
  @HttpCode(HttpStatus.OK)
  async resetPassword(
    @Body() data: AuthResetPasswordDto,
  ): Promise<{ message: string; access_token: string }> {
    try {
      const tokenData = this.authService.validateToken(data.token);
      return await this.authService.resetPassword(
        tokenData.email,
        data.password,
      );
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @UseGuards(AuthGuard)
  @Post('me')
  async me(@Req() req: any) {
    return {
      message: 'authenticated',
      user: req.user,
    };
  }
}
