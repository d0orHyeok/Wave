import { MusicDataDto } from './dto/music-data.dto';
import { User } from 'src/entities/user.entity';
import {
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { Music } from 'src/entities/music.entity';
import { EntityRepository, Repository, SelectQueryBuilder } from 'typeorm';
import { EntityStatus } from 'src/entities/common.types';

@EntityRepository(Music)
export class MusicRepository extends Repository<Music> {
  async createMusic(createMusicData: MusicDataDto, user: User): Promise<Music> {
    const { permalink } = createMusicData;

    const existMusics = await this.findOne({ permalink, user });

    const music = this.create({
      ...createMusicData,
      permalink: !existMusics ? permalink : `${permalink}_${Date.now()}`,
      user,
    });

    try {
      await this.save(music);
      return music;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(
        error,
        `Error ocuur create music.`,
      );
    }
  }

  orderSelectQuery(query: SelectQueryBuilder<Music>) {
    return query
      .orderBy('music.count', 'DESC')
      .addOrderBy('likesCount', 'DESC')
      .addOrderBy('repostsCount', 'DESC');
  }

  musicSimpleQuery() {
    return this.createQueryBuilder('music')
      .leftJoinAndSelect('music.user', 'user')
      .loadRelationCountAndMap('music.likesCount', 'music.likes')
      .loadRelationCountAndMap('music.commentsCount', 'music.comments')
      .loadRelationCountAndMap('music.repostsCount', 'music.reposts');
  }

  musicDetailQuery() {
    return this.createQueryBuilder('music')
      .leftJoinAndSelect('music.user', 'user')
      .leftJoinAndSelect('music.playlists', 'playlists')
      .leftJoinAndSelect('playlists.user', 'pu')
      .leftJoinAndSelect('music.likes', 'likes')
      .leftJoinAndSelect('music.reposts', 'reposts')
      .leftJoinAndSelect('music.comments', 'comments')
      .leftJoinAndSelect('comments.user', 'cu')
      .loadRelationCountAndMap('music.commentsCount', 'music.comments')
      .loadRelationCountAndMap('music.likesCount', 'music.likes')
      .loadRelationCountAndMap('music.repostsCount', 'music.reposts');
  }

  async findMusicById(id: number): Promise<Music> {
    const music = await this.musicDetailQuery()
      .where('music.id = :id', { id })
      .getOne();

    if (!music) {
      throw new NotFoundException(`Can't find Music with id ${id}`);
    }

    return music;
  }

  async findMusicByPermalink(userId: string, permalink: string) {
    try {
      const music = await this.musicDetailQuery()
        .where('user.id = :userId', { userId })
        .andWhere('music.permalink = :permalink', { permalink })
        .getOne();

      if (!music) {
        throw new NotFoundException(
          `Can't find ${userId}'s music name: ${permalink}`,
        );
      }

      return music;
    } catch (error) {
      throw new InternalServerErrorException(error, 'Error to get music');
    }
  }

  async getAllMusic(): Promise<Music[]> {
    try {
      const musics = await this.musicSimpleQuery()
        .where('music.status = :status', { status: 'PUBLIC' })
        .getMany();
      return musics;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(error, 'Error to get musics');
    }
  }

  async findMusicByIds(musicIds: number[]) {
    return this.musicSimpleQuery().whereInIds(musicIds).getMany();
  }

  async deleteMusic(id: number, user: User): Promise<void> {
    try {
      const result = await this.delete({ id, user });
      if (result.affected === 0) {
        throw new NotFoundException(`Can't find Music with id ${id}`);
      }
    } catch (error) {
      throw new InternalServerErrorException(error, 'Error to delete music');
    }
  }

  async updateMusic(music: Music) {
    try {
      await this.save(music);
      return music;
    } catch (error) {
      throw new InternalServerErrorException(
        error,
        `Error to update music, music ID: ${music.id}`,
      );
    }
  }

  async updateMusicStatus(id: number, status: EntityStatus): Promise<Music> {
    const music = await this.findMusicById(id);
    music.status = status;
    return this.updateMusic(music);
  }

  async updateMusicCount(id: number) {
    const music = await this.findMusicById(id);
    music.count += 1;
    return this.updateMusic(music);
  }
}
