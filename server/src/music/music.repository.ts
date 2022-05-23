import { MusicDataDto } from './dto/music-data.dto';
import { User } from 'src/entities/user.entity';
import {
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { Music } from 'src/entities/music.entity';
import { EntityRepository, Repository } from 'typeorm';
import { EntityStatus } from 'src/entities/common.types';

@EntityRepository(Music)
export class MusicRepository extends Repository<Music> {
  async getAllMusic(): Promise<Music[]> {
    return await this.createQueryBuilder('music')
      .leftJoinAndSelect('music.user', 'user')
      .where('music.status = :status', { status: 'PUBLIC' })
      .getMany();
  }

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
        `Error ocuur create music.\n${error}`,
      );
    }
  }

  async findMusicById(id: number): Promise<Music> {
    // const music = await this.findOne(id);
    const music = await this.createQueryBuilder('music')
      .leftJoinAndSelect('music.user', 'user')
      .leftJoinAndSelect('music.playlists', 'playlists')
      .leftJoinAndSelect('playlists.user', 'pu')
      .where('music.id = :id', { id })
      .getOne();

    if (!music) {
      throw new NotFoundException(`Can't find Music with id ${id}`);
    }

    return music;
  }

  async findMusicByPermalink(userId: string, permalink: string) {
    // const music = await this.findOne({ userId, permalink });
    const music = await this.createQueryBuilder('music')
      .leftJoinAndSelect('music.user', 'user')
      .leftJoinAndSelect('music.playlists', 'playlists')
      .leftJoinAndSelect('playlists.user', 'pu')
      .where('user.id = :userId', { userId })
      .andWhere('music.permalink = :permalink', { permalink })
      .getOne();

    if (!music) {
      throw new NotFoundException(
        `Can't find ${userId}'s music name: ${permalink}`,
      );
    }

    return music;
  }

  async findMusicByIds(musicIds: number[]) {
    return this.createQueryBuilder('music')
      .leftJoinAndSelect('music.user', 'user')
      .whereInIds(musicIds)
      .getMany();
  }

  async deleteMusic(id: number, user: User): Promise<void> {
    const result = await this.delete({ id, user });

    if (result.affected === 0) {
      throw new NotFoundException(`Can't find Music with id ${id}`);
    }
  }

  async updateMusicStatus(id: number, status: EntityStatus): Promise<Music> {
    const music = await this.findMusicById(id);

    music.status = status;
    await this.save(music);

    return music;
  }

  async updateMusicCount(id: number) {
    const music = await this.findMusicById(id);
    music.count += 1;
    await this.save(music);

    return music;
  }
}
