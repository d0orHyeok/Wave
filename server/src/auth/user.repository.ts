import { AuthRegisterDto } from './dto/auth-register.dto';
import { User } from 'src/entities/user.entity';
import { EntityRepository, Repository } from 'typeorm';
import {
  ConflictException,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Music } from 'src/entities/music.entity';

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

  getAllColumnQuery() {
    return this.createQueryBuilder('user')
      .leftJoinAndSelect('user.playlists', 'playlists')
      .leftJoinAndSelect('playlists.musics', 'musics')
      .leftJoinAndSelect('musics.user', 'pmu')
      .leftJoinAndSelect('user.likeMusics', 'likeMusics')
      .leftJoinAndSelect('likeMusics.user', 'lmu')
      .leftJoinAndSelect('user.followers', 'followers')
      .leftJoinAndSelect('user.following', 'following')
      .leftJoinAndSelect('user.repostMusics', 'repostMusics')
      .leftJoinAndSelect('repostMusics.user', 'rmu');
  }

  async findUserByUsername(username: string): Promise<User> {
    const user = await this.getAllColumnQuery()
      .addSelect('user.hashedRefreshToken')
      .addSelect('user.password')
      .where('user.username = :username', { username })
      .getOne();

    if (!user) {
      throw new UnauthorizedException(`Can't find User with id: ${username}`);
    }

    return user;
  }

  async findUserById(id: string) {
    const user = await this.getAllColumnQuery()
      .where('user.id = :id', { id })
      .getOne();

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

  async likeMusic(user: User, music: Music) {
    const likeMusics = user.likeMusics || [];
    if (likeMusics.findIndex((m) => m.id === music.id) !== -1) {
      return likeMusics;
    }
    const newLikeMusics = [...likeMusics, music];
    user.likeMusics = newLikeMusics;
    try {
      await this.save(user);
      return newLikeMusics;
    } catch (error) {
      throw new InternalServerErrorException(
        error,
        `Error to update likeMusics`,
      );
    }
  }

  async unlikeMusic(user: User, music: Music) {
    const likeMusics = user.likeMusics || [];
    const newLikeMusics = likeMusics.filter((m) => m.id !== music.id);
    user.likeMusics = newLikeMusics;

    try {
      await this.save(user);
      return newLikeMusics;
    } catch (error) {
      throw new InternalServerErrorException(
        error,
        `Error to update likeMusics`,
      );
    }
  }

  async followUser(user: User, target: User) {
    const following = user.following || [];
    if (following.findIndex((f) => f.id === target.id) !== -1) {
      return following;
    }
    const newFollowing = [...following, target];
    user.following = newFollowing;
    try {
      const updatedUser = await this.save(user);
      const { followers, following } = updatedUser;
      return { followers, following };
    } catch (error) {
      throw new InternalServerErrorException(error, `Error to update follow`);
    }
  }

  async unfollowUser(user: User, target: User) {
    const following = user.following || [];
    const newFollowing = following.filter((f) => f.id !== target.id);
    user.following = newFollowing;
    try {
      const updatedUser = await this.save(user);
      const { followers, following } = updatedUser;
      return { followers, following };
    } catch (error) {
      throw new InternalServerErrorException(error, `Error to update follow`);
    }
  }

  async toggleRepostMusic(user: User, music: Music) {
    const reposts = user.repostMusics || [];
    let findIndex = -1;
    const newReposts = reposts.filter((m, index) => {
      if (m.id !== music.id) {
        return true;
      } else {
        findIndex = index;
        return false;
      }
    });

    if (findIndex === -1) {
      newReposts.push(music);
      user.repostMusics = newReposts;
    } else {
      user.repostMusics = newReposts;
    }

    try {
      await this.save(user);
      return {
        type: findIndex === -1 ? 'repost' : 'unrepost',
        reposts: newReposts,
      };
    } catch (error) {
      throw new InternalServerErrorException(error, `Error to update reposts`);
    }
  }
}
