import { IsString, IsArray, IsNotEmpty } from 'class-validator';

export class CreateApplicationDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsArray()
  @IsString({ each: true })
  controllers: string[]; 

  @IsArray()
  @IsString({ each: true })
  allowedRoles: string[];
}
