import { UpdatePlaylistDto } from './dto/updatePlaylistDto';
import { CreatePlaylistDto } from './dto/createPlaylistDto';
import { MusicRepository } from './../music/music.repository';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { PlaylistRepository } from './playlist.repository';

@Injectable()
export class PlaylistService {
  constructor(
    @InjectRepository(PlaylistRepository)
    private playlistRepository: PlaylistRepository,
    private musicRepository: MusicRepository,
  ) {}

  async createPlaylist(user: User, createPlaylistDto: CreatePlaylistDto) {
    const { musicIds } = createPlaylistDto;
    const musics = await this.musicRepository.findMusicByIds(musicIds || []);
    return this.playlistRepository.createPlaylist(
      user,
      createPlaylistDto,
      musics,
    );
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

  async updatePlaylistInfo(id: number, updatePlaylistDto: UpdatePlaylistDto) {
    return this.playlistRepository.updatePlaylistInfo(id, updatePlaylistDto);
  }

  async addMusicToPlaylist(id: number, musicIds: number[]) {
    const musics = await this.musicRepository.findMusicByIds(musicIds);
    return this.playlistRepository.addMusicToPlaylist(id, musics);
  }

  async deleteMusic(musicId: number, playlistId: number) {
    return this.playlistRepository.deleteMusic(musicId, playlistId);
  }

  async deletePlaylist(id: number, user: User) {
    return this.playlistRepository.deletePlaylist(id, user);
  }
}
