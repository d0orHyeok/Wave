import { Music } from 'src/entities/music.entity';
import { Playlist } from './../entities/playlist.entity';
import { PlaylistMusic } from './../entities/playlistMusic.entity';
import { EntityRepository, Repository } from 'typeorm';
import {
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';

@EntityRepository(PlaylistMusic)
export class PlaylistMusicRepository extends Repository<PlaylistMusic> {
  async createPlaylistMusics(playlist: Playlist, musics: Music[]) {
    const playlistMusics = musics.map((music) =>
      this.create({ playlist, music }),
    );

    try {
      await this.save(playlistMusics);
      return playlistMusics;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
  }

  async deletePlaylistMusic(musicId: number, playlistId: number) {
    const result = await this.delete({ musicId, playlistId });

    if (result.affected === 0) {
      throw new NotFoundException(
        `Can't find musicId(${musicId}) in playlistId(${playlistId})`,
      );
    }
  }
}
