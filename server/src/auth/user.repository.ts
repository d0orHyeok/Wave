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
import { Playlist } from 'src/entities/playlist.entity';

type TargetType = Music | Playlist;

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
        throw new InternalServerErrorException(error, 'Error to create user');
      }
    }
  }

  getSimpleQuery() {
    return this.createQueryBuilder('user')
      .loadRelationCountAndMap('user.followersCount', 'user.followers')
      .loadRelationCountAndMap('user.followingCount', 'user.following')
      .loadRelationCountAndMap('user.playlistsCount', 'user.playlists')
      .loadRelationCountAndMap('user.likeMusicsCount', 'user.likeMusics')
      .loadRelationCountAndMap('user.repostMusicsCount', 'user.repostMusics')
      .loadRelationCountAndMap('user.likePlaylistsCount', 'user.likePlaylists')
      .loadRelationCountAndMap(
        'user.repostPlaylistsCount',
        'user.repostPlaylists',
      )
      .loadRelationCountAndMap('user.commentsCount', 'user.comments')
      .loadRelationCountAndMap('user.musicsCount', 'user.musics');
  }

  getDetailQuery() {
    return this.createQueryBuilder('user')
      .leftJoinAndSelect('user.musics', 'musics')
      .leftJoinAndSelect('user.playlists', 'playlists')
      .leftJoinAndSelect('playlists.musics', 'pm')
      .leftJoinAndSelect('pm.user', 'pmu')
      .leftJoinAndSelect('user.likeMusics', 'lm')
      .leftJoinAndSelect('user.repostMusics', 'rm')
      .leftJoinAndSelect('user.likePlaylists', 'lp')
      .leftJoinAndSelect('user.repostPlaylists', 'rp')
      .leftJoinAndSelect('lm.user', 'lmu')
      .leftJoinAndSelect('rm.user', 'rmu')
      .leftJoinAndSelect('lp.user', 'lpu')
      .leftJoinAndSelect('rp.user', 'rpu')
      .leftJoinAndSelect('user.followers', 'followers')
      .leftJoinAndSelect('user.following', 'following')
      .loadRelationCountAndMap('user.followersCount', 'user.followers')
      .loadRelationCountAndMap('user.followingCount', 'user.following')
      .loadRelationCountAndMap('user.playlistsCount', 'user.playlists')
      .loadRelationCountAndMap('user.likeMusicsCount', 'user.likeMusics')
      .loadRelationCountAndMap('user.repostMusicsCount', 'user.repostMusics')
      .loadRelationCountAndMap('user.likePlaylistsCount', 'user.likePlaylists')
      .loadRelationCountAndMap(
        'user.repostPlaylistsCount',
        'user.repostPlaylists',
      )
      .loadRelationCountAndMap('user.commentsCount', 'user.comments')
      .loadRelationCountAndMap('user.musicsCount', 'user.musics');
  }

  async findUserByUsername(username: string): Promise<User> {
    const user = await this.getDetailQuery()
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
    const user = await this.getDetailQuery()
      .where('user.id = :id', { id })
      .getOne();

    if (!user) {
      throw new NotFoundException(`Can't find User with id: ${id}`);
    }

    return user;
  }

  async updateRefreshToken(user: User, hashedRefreshToken?: string) {
    try {
      await this.createQueryBuilder()
        .update(User)
        .set({ hashedRefreshToken })
        .where('id = :id', { id: user.id })
        .execute();
    } catch (error) {
      throw new InternalServerErrorException(
        error,
        'Error to update refreshToken',
      );
    }
  }

  async toggleFollow(user: User, target: User) {
    const following = user.following || [];
    let findIndex = -1;
    const newFollowing = following.filter((f, index) => {
      if (f.id !== target.id) {
        return true;
      } else {
        findIndex = index;
        return false;
      }
    });

    if (findIndex === -1) {
      newFollowing.push(target);
    }
    user.following = newFollowing;

    try {
      await this.save(user);
      return {
        type: findIndex === -1 ? 'follow' : 'unfollow',
        following: newFollowing,
      };
    } catch (error) {
      throw new InternalServerErrorException(error, `Error to update follow`);
    }
  }

  async toggleColumnTarget(
    user: User,
    target: TargetType,
    column: 'like' | 'repost',
  ) {
    const columnName = column + ('title' in target ? 'Musics' : 'Playlists');
    const targetItems: TargetType[] = user[columnName] || [];
    let findIndex = -1;
    const newTargetItems = targetItems.filter((item, index) => {
      if (item.id !== target.id) {
        return true;
      } else {
        findIndex = index;
        return false;
      }
    });

    if (findIndex === -1) {
      newTargetItems.push(target);
    }
    user[columnName] = newTargetItems;

    try {
      await this.save(user);
      return {
        toggleType: findIndex === -1 ? column : `un${column}`,
        [columnName]: newTargetItems,
      };
    } catch (error) {
      throw new InternalServerErrorException(
        error,
        `Error to update ${columnName}`,
      );
    }
  }
}
