import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { RegisterDto } from './register.dto';

type _LoginDto = Omit<RegisterDto, 'name'>;

export class LoginDto implements _LoginDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
