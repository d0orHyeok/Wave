import { IsEmail, IsString } from 'class-validator';
import { AuthCredentailDto } from './auth-credential.dto';

export class AuthRegisterDto extends AuthCredentailDto {
  @IsEmail()
  email: string;

  @IsString()
  nickname: string;
}
