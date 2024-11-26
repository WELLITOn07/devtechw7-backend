import {
  Body,
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
import { AuthLoginDto } from './_dto/auth-login.dto';
import { AuthForgotPasswordDto } from './_dto/auth-forgot.dto';
import { AuthResetPasswordDto } from './_dto/auth-reset-password.dto';
import { AuthGuard } from './_guards/auth.guard';
import { userDecorator } from '../_decorators/user.decorator';
import { User } from '@prisma/client';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

   @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(
    @Body() data: AuthLoginDto,
  ): Promise<{ access_token: string; user: Omit<User, 'password'> }> {
    try {
      const { email, password, application } = data;
      const { access_token, user } = await this.authService.login(
        email,
        password,
        application,
      );

      return {
        access_token,
        user,
      };
    } catch (error) {
      throw new BadRequestException(error.message || 'Login failed');
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
  async me(@userDecorator() user: User) {
    return {
      message: 'authenticated',
      user: user,
    };
  }
}
