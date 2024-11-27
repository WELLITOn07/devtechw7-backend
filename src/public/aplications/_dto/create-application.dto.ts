// src/application/dto/create-application.dto.ts
import { IsArray, IsString, IsNotEmpty } from 'class-validator';

export class CreateApplicationDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsArray()
  @IsString({ each: true })
  allowedRoles: string[];

  @IsString()
  @IsNotEmpty()
  urlOrigin: string;
}