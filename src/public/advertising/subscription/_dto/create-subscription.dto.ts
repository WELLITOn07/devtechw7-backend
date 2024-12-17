import { IsEmail, IsArray, ArrayNotEmpty, IsInt } from 'class-validator';

export class CreateSubscriptionDto {
  @IsEmail()
  email: string;

  @IsArray()
  @ArrayNotEmpty()
  @IsInt({ each: true })
  applicationIds: number[];
}
