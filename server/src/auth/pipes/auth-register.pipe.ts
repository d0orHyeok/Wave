import { AuthRegisterDto } from './../dto/auth-register.dto';
import { PipeTransform, InternalServerErrorException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';

export class AuthRegisterPipe implements PipeTransform {
  transform(authRegisterDto: AuthRegisterDto) {
    const { password, username, nickname } = authRegisterDto;

    let hashedPassword = '';

    this.hashPasswrod(password)
      .then((result) => (hashedPassword = result))
      .catch((error) => {
        throw new InternalServerErrorException(
          `Error occur encrypting the password.\n${error} `,
        );
      });

    return {
      ...authRegisterDto,
      password: hashedPassword,
      nickname: nickname ? nickname : username,
    };
  }

  private async hashPasswrod(password: string) {
    const salt = await bcrypt.genSalt();
    return await bcrypt.hash(password, salt);
  }
}
