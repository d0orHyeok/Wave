import { MusicRepository } from 'src/music/music.repository';
import { LikeRepository } from './like.repository';
import { FollowRepository } from './follow.repository';
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
    private followRepository: FollowRepository,
    private likeRepository: LikeRepository,
    private musicRepository: MusicRepository,
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

    const user = await this.userRepository.findUserByUsername(username);
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

  async getUserData(user: User) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, hashedRefreshToken, ...userData } = user;
    const followData = await this.followRepository.getFollow(user);
    const likes = await this.likeRepository.getLikes(user);
    return { ...userData, ...followData, likes };
  }

  async likeMusic(user: User, musicId: number) {
    const music = await this.musicRepository.findOne({ id: musicId });
    if (music) {
      await this.likeRepository.createLike(user, music);
    }
    return this.likeRepository.getLikes(user);
  }

  async unlikeMusic(user: User, musicId: number) {
    const music = await this.musicRepository.findOne({ id: musicId });
    if (music) {
      await this.likeRepository.deleteLike(user, music);
    }
    return this.likeRepository.getLikes(user);
  }

  async followUser(user: User, followerId: number) {
    const follower = await this.userRepository.findOne({ id: followerId });
    if (follower) {
      await this.followRepository.createFollow(user, follower);
    }
    return this.followRepository.getFollow(user);
  }

  async unfollowUser(user: User, followerId: number) {
    const follower = await this.userRepository.findOne({ id: followerId });
    if (follower) {
      await this.followRepository.deleteFollow(user, follower);
    }
    return this.followRepository.getFollow(user);
  }
}
