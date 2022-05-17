import { AuthService } from './../auth/auth.service';
import { CreatePlaylistDto } from './dto/createPlaylistDto';
import { MusicRepository } from './../music/music.repository';
import { PlaylistMusicRepository } from './playlistMusic.repository';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { PlaylistRepository } from './playlist.repository';
import { Playlist } from 'src/entities/playlist.entity';

@Injectable()
export class PlaylistService {
  constructor(
    @InjectRepository(PlaylistRepository)
    private authService: AuthService,

    private playlistRepository: PlaylistRepository,
    private playlistMusicRepository: PlaylistMusicRepository,
    private musicRepository: MusicRepository,
  ) {}

  async createPlaylist(user: User, createPlaylistDto: CreatePlaylistDto) {
    const { musicIds } = createPlaylistDto;
    const playlist = await this.playlistRepository.createPlaylist(
      user,
      createPlaylistDto,
    );
    await this.addMusics(playlist, musicIds);

    return playlist;
  }

  async findPlaylistById(id: number) {
    const playlist = await this.playlistRepository.findOne({ id });
    if (!playlist) {
      throw new NotFoundException(`Can't find playlist with id ${id}`);
    }
    return playlist;
  }

  async findPlaylistByPermalink(userId: string, permalink: string) {
    return this.playlistRepository.findPlaylistByPermalink(userId, permalink);
  }

  async getPlaylistData(playlist: Playlist) {
    const { playlistMusics, ...paylistData } = playlist;

    return {
      ...paylistData,
      musics: playlistMusics.map((pm) => pm.music),
    };
  }

  async addMusics(playlist: Playlist, musicIds: number[]) {
    const musics = await this.musicRepository
      .createQueryBuilder('music')
      .whereInIds(musicIds)
      .getMany();
    return this.playlistMusicRepository.createPlaylistMusics(playlist, musics);
  }

  async deleteMusic(musicId: number, playlistId: number) {
    return this.playlistMusicRepository.deletePlaylistMusic(
      musicId,
      playlistId,
    );
  }

  async deletePlaylist(id: number, user: User) {
    return this.playlistRepository.deletePlaylist(id, user);
  }
}
