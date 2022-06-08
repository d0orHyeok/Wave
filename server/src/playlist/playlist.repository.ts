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
import { PagingDto } from 'src/common/dto/paging.dto';

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
        throw new InternalServerErrorException(
          error,
          'Error to create playlist',
        );
      }
    }
  }

  getDetailPlaylistQuery() {
    return this.createQueryBuilder('playlist')
      .leftJoinAndSelect('playlist.user', 'user')
      .leftJoinAndSelect('playlist.musics', 'musics')
      .leftJoinAndSelect('musics.user', 'pmu')
      .loadRelationCountAndMap('playlist.musicsCount', 'playlist.musics')
      .loadRelationCountAndMap('playlist.likesCount', 'playlist.likes')
      .loadRelationCountAndMap('playlist.repostsCount', 'playlist.reposts');
  }

  async findPlaylistById(playlistId: number) {
    const playlist = await this.getDetailPlaylistQuery()
      .where('playlist.id = :id', { id: playlistId })
      .getOne();

    if (!playlist) {
      throw new NotFoundException(`Can't find playlist with id ${playlistId}`);
    }
    return playlist;
  }

  async findPlaylistByPermalink(userId: string, permalink: string) {
    const playlist = await this.getDetailPlaylistQuery()
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

  async updatePlaylistInfo(
    playlistId: number,
    updatePlaylistDto: UpdatePlaylistDto,
  ) {
    const playlist = await this.findPlaylistById(playlistId);
    Object.entries(updatePlaylistDto).forEach((entrie) => {
      const [key, value] = entrie;
      if (value) {
        playlist[key] = value;
      }
    });

    try {
      const updatedPlaylist = await this.save(playlist);
      return updatedPlaylist;
    } catch (error) {
      throw new InternalServerErrorException(
        error,
        'Error to update playlist info',
      );
    }
  }

  async addMusicToPlaylist(playlistId: number, musics: Music[]) {
    const playlist = await this.findPlaylistById(playlistId);
    const existMusics = playlist.musics;
    playlist.musics = [...existMusics, ...musics];
    try {
      return await this.save(playlist);
    } catch (err) {
      console.log(err);
      throw new InternalServerErrorException('Fail to update playlist musics');
    }
  }

  async deleteMusic(playlistId: number, musicIds: number[]) {
    const playlist = await this.findPlaylistById(playlistId);
    const existMusics = playlist.musics;
    playlist.musics = existMusics.filter(
      (music) => !musicIds.includes(music.id),
    );
    try {
      return await this.save(playlist);
    } catch (err) {
      throw new InternalServerErrorException('Fail to update playlist musics');
    }
  }

  async deletePlaylist(id: number, user: User): Promise<void> {
    try {
      const result = await this.delete({ id, user });
      if (result.affected === 0) {
        throw new NotFoundException(`Can't find Playlist with id ${id}`);
      }
    } catch (error) {
      throw new InternalServerErrorException(error, 'Error to delete playlist');
    }
  }

  async findDetailPlaylistsById(id: number, pagingDto: PagingDto) {
    const { skip, take } = pagingDto;

    try {
      const result = await this.createQueryBuilder('playlist')
        .leftJoinAndSelect('playlist.musics', 'musics')
        .select('playlist.id')
        .where('musics.id = :musicsid', { musicsid: id })
        .skip(skip)
        .take(take)
        .getMany();
      const playlistIds = result.map((value) => value.id);
      return this.getDetailPlaylistQuery().whereInIds(playlistIds).getMany();
    } catch (error) {
      throw new InternalServerErrorException(
        error,
        'Error to get detail playlists',
      );
    }
  }
}
