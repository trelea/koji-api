import { IsNotEmpty, IsString } from 'class-validator';

export class OTPDto {
  @IsNotEmpty()
  @IsString()
  otp: string;
}
