import {
  Body,
  Controller,
  Post,
  HttpCode,
  HttpStatus,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { UserService } from './../user/services/user.service';
import { AuthService } from './auth.service';
import { AuthLoginDto } from './dto/auth-login.dto';
import { AuthRegisterDto } from './dto/auth-register.dto';
import { AuthForgotPasswordDto } from './dto/auth-forgot.dto';
import { AuthResetPasswordDto } from './dto/auth-reset-password.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async authLogin(@Body() data: AuthLoginDto) {
    try {
      return await this.authService.login(data.email, data.password);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async authRegister(@Body() data: AuthRegisterDto) {
    try {
      return await this.userService.createUser(data);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Post('forgot-password')
  @HttpCode(HttpStatus.OK)
  async authForgotPassword(@Body() data: AuthForgotPasswordDto) {
    try {
      await this.authService.forgotPassword();
      return { message: 'Password reset link sent' };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Post('reset-password')
  @HttpCode(HttpStatus.OK)
  async authResetPassword(@Body() data: AuthResetPasswordDto) {
    try {
      await this.authService.resetPassword();
      return { message: 'Password successfully reset' };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
