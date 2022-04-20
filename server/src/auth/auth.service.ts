import { AuthRegisterDto } from './dto/auth-register.dto';
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

  async signUp(authRegisterDto: AuthRegisterDto): Promise<void> {
    const { password } = authRegisterDto;

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    return this.userRepository.createUser({
      ...authRegisterDto,
      password: hashedPassword,
    });
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
      expiresIn: Number(
        this.config.get<number>('JWT_ACCESS_TOKEN_EXPIRATION_TIME'),
      ),
    });

    return accessToken;
  }

  getRefreshTokenWithCookie(payload: any): {
    refreshToken: string;
    cookieOption: CookieOptions;
  } {
    const refreshToken = this.jwtService.sign(payload, {
      secret: this.config.get<string>('JWT_REFRESH_TOKEN_SECREAT'),
      expiresIn: Number(
        this.config.get<number>('JWT_REFRESH_TOKEN_EXPIRATION_TIME'),
      ),
    });

    return {
      refreshToken,
      cookieOption: {
        httpOnly: true,
      },
    };
  }

  async setCurrentRefreshToken(
    refreshToken: string,
    user: User,
  ): Promise<void> {
    const salt = await bcrypt.genSalt();
    const hashedRefreshToken = await bcrypt.hash(refreshToken, salt);

    user.hashedRefreshToken = hashedRefreshToken;
    await this.userRepository.save(user);
  }

  async compareRefreshToken(
    refreshToken: string,
    hashedRefreshToken: string,
  ): Promise<void> {
    const isMatch = await bcrypt.compare(refreshToken, hashedRefreshToken);
    if (!isMatch) {
      throw new UnauthorizedException(
        'RefreshToken is not match\nPlease SignIn again',
      );
    }
  }

  async removeRefreshTokenWithCookie(user: User): Promise<CookieOptions> {
    user.hashedRefreshToken = null;
    await this.userRepository.save(user);

    return {
      httpOnly: true,
      maxAge: 0,
    };
  }

  getUserData(user: User) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, hashedRefreshToken, ...userData } = user;
    return userData;
  }

  async pushLikes(user: User, musicId: number) {
    const updatedUser = await this.userRepository.pushLikes(user, musicId);
    return this.getUserData(updatedUser);
  }

  async pullLikes(user: User, musicId: number) {
    const updatedUser = await this.userRepository.pullLikes(user, musicId);
    return this.getUserData(updatedUser);
  }
}
