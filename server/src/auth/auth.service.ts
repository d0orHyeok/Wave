import { ConfigService } from '@nestjs/config';
import { AuthCredentailDto } from './dto/auth-credential.dto';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from './user.repository';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { User } from 'src/entities/user.entity';
import { CookieOptions } from 'express';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
    private jwtService: JwtService,
    private config: ConfigService,
  ) {}

  async signUp(authCredentailDto: AuthCredentailDto): Promise<void> {
    return this.userRepository.createUser(authCredentailDto);
  }

  async validateUser(authCredentailDto: AuthCredentailDto): Promise<User> {
    const { username, password } = authCredentailDto;

    const user = await this.userRepository.findUserById(username);
    await this.comparePassword(password, user.password);

    return user;
  }

  async comparePassword(
    plainPassword: string,
    hashedPassword: string,
  ): Promise<void> {
    const isMatch = await bcrypt.compare(plainPassword, hashedPassword);
    if (!isMatch) {
      throw new UnauthorizedException('Wrong Password');
    }
  }

  getAccessToken(payload: any): string {
    const accessToken = this.jwtService.sign(payload, {
      secret: this.config.get<string>('JWT_ACCESS_TOKEN_SECREAT'),
      expiresIn: this.config.get<number>('JWT_ACCESS_TOKEN_EXPIRATION_TIME'),
    });

    return accessToken;
  }

  getCookieWithRefreshToken(payload: any): {
    refreshToken: string;
    cookieOption: CookieOptions;
  } {
    const refreshToken = this.jwtService.sign(payload, {
      secret: this.config.get<string>('JWT_REFRESH_TOKEN_SECREAT'),
      expiresIn: this.config.get<number>('JWT_REFRESH_TOKEN_EXPIRATION_TIME'),
    });

    return {
      refreshToken,
      cookieOption: {
        secure: true,
        httpOnly: true,
        maxAge:
          Number(this.config.get<number>('JWT_REFRESH_TOKEN_EXPIRATION_TIME')) *
          1000,
      },
    };
  }
}
