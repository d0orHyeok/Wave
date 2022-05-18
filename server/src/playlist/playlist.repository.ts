import { UpdatePlaylistDto } from './dto/updatePlaylistDto';
import { CreatePlaylistDto } from './dto/createPlaylistDto';
import {
  ConflictException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { User } from 'src/entities/user.entity';
import { Playlist } from './../entities/playlist.entity';
import { EntityRepository, Repository } from 'typeorm';
import { Music } from 'src/entities/music.entity';

@EntityRepository(Playlist)
export class PlaylistRepository extends Repository<Playlist> {
  async createPlaylist(
    user: User,
    createPlaylistDto: CreatePlaylistDto,
    musics: Music[],
  ) {
    const { name: permalink, status } = createPlaylistDto;

    const findPlaylist = await this.findOne({ user, permalink });

    const playlist = this.create({
      status,
      name: permalink,
      permalink: !findPlaylist ? permalink : `${permalink}_${Date.now()}`,
      user,
      musics,
    });

    try {
      const result = await this.save(playlist);
      return result;
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException('Existing playlist');
      } else {
        console.log(error);
        throw new InternalServerErrorException();
      }
    }
  }

  async addMusicToPlaylist(id: number, musics: Music[]) {
    const playlist = await this.findPlaylistById(id);
    const existMusics = playlist.musics;
    playlist.musics = [...existMusics, ...musics];
    return await this.save(playlist);
  }

  async findPlaylistById(id: number) {
    const playlist = await this.createQueryBuilder('playlist')
      .leftJoinAndSelect('playlist.user', 'user')
      .leftJoinAndSelect('playlist.musics', 'musics')
      .leftJoinAndSelect('musics.user', 'pmu')
      .select(['playlist', 'user', 'musics', 'pmu.username'])
      .where('playlist.id = :id', { id })
      .getOne();

    if (!playlist) {
      throw new NotFoundException(`Can't find playlist with id ${id}`);
    }
    return playlist;
  }

  async findPlaylistByPermalink(userId: string, permalink: string) {
    const playlist = await this.createQueryBuilder('playlist')
      .leftJoinAndSelect('playlist.user', 'user')
      .leftJoinAndSelect('playlist.musics', 'musics')
      .leftJoinAndSelect('musics.user', 'pmu')
      .select(['playlist', 'user', 'musics', 'pmu.username'])
      .where('user.id = :userId', { userId })
      .andWhere('playlist.permalink = :permalink', { permalink })
      .getOne();

    if (!playlist) {
      throw new NotFoundException(
        `Can't find ${userId}'s playlist permalink: ${permalink}`,
      );
    }

    return playlist;
  }

  async updatePlaylistInfo(id: number, updatePlaylistDto: UpdatePlaylistDto) {
    const playlist = await this.findPlaylistById(id);
    Object.entries(updatePlaylistDto).forEach((entrie) => {
      const [key, value] = entrie;
      if (value.length > 0) {
        playlist[key] = value;
      }
    });
    return this.save(playlist);
  }

  async deleteMusic(musicId: number, playlistId: number) {
    const playlist = await this.findPlaylistById(playlistId);
    const existMusics = playlist.musics;
    playlist.musics = existMusics.filter((music) => music.id !== musicId);
    return await this.save(playlist);
  }

  async deletePlaylist(id: number, user: User): Promise<void> {
    const result = await this.delete({ id, user });

    if (result.affected === 0) {
      throw new NotFoundException(`Can't find Playlist with id ${id}`);
    }
  }
}
