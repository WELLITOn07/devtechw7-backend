import { IsEmail } from 'class-validator';

export class AuthForgotPasswordDto {
  @IsEmail()
  email: string;
}
