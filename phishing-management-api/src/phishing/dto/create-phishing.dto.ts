import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class CreatePhishingDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsEmail()
  targetEmail: string;

  @IsNotEmpty()
  @IsString()
  templateId: string;

  @IsNotEmpty()
  @IsString()
  subject: string;

  @IsNotEmpty()
  @IsString()
  content: string;
}
