import { UserService } from './../user/services/user.service';
import { Body, Controller, Post } from '@nestjs/common';
import { AuthLoginDto } from './dto/auth-login.dto';
import { AuthRegisterDto } from './dto/auth-register.dto';
import { AuthForgotPasswordDto } from './dto/auth-forgot.dto';
import { AuthResetPasswordDto } from './dto/auth-reset-password.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly UserService: UserService) {}

  @Post('login')
  async login(@Body() data: AuthLoginDto) {}

  @Post('register')
  async register(@Body() data: AuthRegisterDto) {
    return this.UserService.createUser(data);
  }

  @Post('forgot-password')
  async forgotPassword(@Body() data: AuthForgotPasswordDto) {}

  @Post('reset-password')
  async resetPassword(@Body() data: AuthResetPasswordDto) {}
}
