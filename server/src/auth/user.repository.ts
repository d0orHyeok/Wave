import { AuthCredentailDto } from './dto/auth-credential.dto';
import { User } from 'src/entities/user.entity';
import { EntityRepository, Repository } from 'typeorm';
import {
  ConflictException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  async createUser(authCredentailDto: AuthCredentailDto): Promise<void> {
    const user = this.create(authCredentailDto);

    try {
      await this.save(user);
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException('Existing username');
      } else {
        console.log(error);
        throw new InternalServerErrorException();
      }
    }
  }

  async findUserById(id: string): Promise<User> {
    const user = await this.findOne({ username: id });

    if (!user) {
      throw new NotFoundException(`Can't find User with id ${id}`);
    }

    return user;
  }
}
