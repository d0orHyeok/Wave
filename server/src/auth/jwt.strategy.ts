import { ConfigService } from '@nestjs/config';
import { User } from 'src/entities/user.entity';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserRepository } from './user.repository';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
    readonly config: ConfigService,
  ) {
    super({
      secretOrKey: process.env.JWT_SECRET || config.get<string>('JWT_SECRET'),
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    });
  }

  async validate(payload) {
    const { id } = payload;
    const user: User = await this.userRepository.findOne({ id });

    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }
}
