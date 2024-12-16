import { IsInt, IsString, Min } from 'class-validator';

export class CreateAnalyticsEventDto {
  @IsString()
  application: string;

  @IsString()
  eventType: string;

  @IsString()
  eventName: string;

  @IsInt()
  @Min(1)
  quantity: number;
}
