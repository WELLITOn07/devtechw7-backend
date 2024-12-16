import { IsString, IsInt, IsNotEmpty, IsBase64 } from 'class-validator';

export class CreateAdvertisementDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsNotEmpty()
  link: string;

  @IsBase64()
  image: string;

  @IsInt()
  applicationId: number;
}
