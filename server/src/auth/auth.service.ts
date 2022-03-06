import { AuthCredentailDto } from './dto/auth-credential.dto';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from './user.repository';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
    private jwtService: JwtService,
  ) {}

  async signUp(authCredentailDto: AuthCredentailDto): Promise<void> {
    return this.userRepository.createUser(authCredentailDto);
  }

  async signIn(
    authCredentailDto: AuthCredentailDto,
  ): Promise<{ accessToken: string }> {
    const user = await this.userRepository.findUser(authCredentailDto);

    const payload = { username: user.username };
    const accessToken = await this.jwtService.sign(payload);

    return { accessToken };
  }
}
