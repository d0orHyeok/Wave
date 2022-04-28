import { AuthRegisterDto } from './../dto/auth-register.dto';
import { PipeTransform, InternalServerErrorException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';

export class AuthRegisterPipe implements PipeTransform {
  async transform(authRegisterDto: AuthRegisterDto) {
    const { password, username, nickname } = authRegisterDto;

    try {
      const hashedPassword = await this.hashPasswrod(password);

      return {
        ...authRegisterDto,
        password: hashedPassword,
        nickname: nickname ? nickname : username,
      };
    } catch (error) {
      throw new InternalServerErrorException(
        `Error occur encrypting the password.\n${error} `,
      );
    }
  }

  private async hashPasswrod(password: string) {
    const salt = await bcrypt.genSalt();
    return await bcrypt.hash(password, salt);
  }
}
