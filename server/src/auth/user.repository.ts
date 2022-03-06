import { AuthCredentailDto } from './dto/auth-credential.dto';
import { User } from 'src/entities/user.entity';
import { EntityRepository, Repository } from 'typeorm';
import {
  ConflictException,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcryptjs';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  async createUser(authCredentailDto: AuthCredentailDto): Promise<void> {
    const { username, password } = authCredentailDto;

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = this.create({ username, password: hashedPassword });

    try {
      await this.save(user);
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException('Existing username');
      } else {
        throw new InternalServerErrorException();
      }
    }
  }

  async findUser(authCredentailDto: AuthCredentailDto): Promise<User> {
    const { username, password } = authCredentailDto;

    const user = await this.findOne({ username });

    if (!user) {
      throw new NotFoundException(`Can't find User with name ${username}`);
    }
    if (!(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException('Wrong Password');
    }

    return user;
  }
}
