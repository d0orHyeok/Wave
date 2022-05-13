import { AuthRegisterDto } from './dto/auth-register.dto';
import { User } from 'src/entities/user.entity';
import { EntityRepository, Repository } from 'typeorm';
import {
  ConflictException,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  async createUser(authRegisterlDto: AuthRegisterDto): Promise<void> {
    const user = this.create(authRegisterlDto);

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

  getCols<T>(): (keyof T)[] {
    return this.metadata.columns.map((col) => col.propertyName) as (keyof T)[];
  }

  async findUserByUsername(username: string): Promise<User> {
    // const user = await this.createQueryBuilder('user')
    //   .select('*')
    //   .where('user.username = :username', { username: username })
    //   .getOne();
    const user = await this.findOne({
      where: { username },
      select: this.getCols(),
    });

    if (!user) {
      throw new UnauthorizedException(`Can't find User with id: ${username}`);
    }

    return user;
  }

  async findUserById(id: string) {
    const user = await this.findOne({ id });

    if (!user) {
      throw new NotFoundException(`Can't find User with id: ${id}`);
    }

    return user;
  }

  async updateRefreshToken(user: User, hashedRefreshToken?: string) {
    return this.createQueryBuilder()
      .update(User)
      .set({ hashedRefreshToken })
      .where('id = :id', { id: user.id })
      .execute();
  }
}
