import { IsEmail, IsInt } from 'class-validator';

export class CreateSubscriptionDto {
  @IsEmail()
  email: string;

  @IsInt()
  applicationId: number;
}
