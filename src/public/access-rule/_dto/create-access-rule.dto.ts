import { IsArray, IsString, IsNotEmpty } from 'class-validator';

export class CreateAccessRuleDto {
  @IsString()
  @IsNotEmpty()
  urlOrigin: string;

  @IsArray()
  @IsString({ each: true })
  allowedRoles: string[];
}