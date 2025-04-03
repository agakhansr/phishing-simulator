import { IsEmail, IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class SendPhishingDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  templateId: string;

  @IsOptional()
  metadata?: Record<string, any>;
}
