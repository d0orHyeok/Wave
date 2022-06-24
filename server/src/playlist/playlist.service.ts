import { UserRepository } from 'src/auth/user.repository';
import { UpdatePlaylistDto } from './dto/updatePlaylistDto';
import { CreatePlaylistDto } from './dto/createPlaylistDto';
import { MusicRepository } from './../music/music.repository';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { PlaylistRepository } from './playlist.repository';
import { PagingDto } from 'src/common/dto/paging.dto';

@Injectable()
export class PlaylistService {
  constructor(
    @InjectRepository(PlaylistRepository)
    private playlistRepository: PlaylistRepository,
    private musicRepository: MusicRepository,
    private userRepository: UserRepository,
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
    const playlist = await this.playlistRepository.findPlaylistById(id);
    const user = await this.userRepository.findUserById(playlist.userId);
    return { ...playlist, user };
  }

  async findPlaylistsByIds(playlistIds: number[]) {
    return this.playlistRepository
      .getDetailPlaylistQuery()
      .whereInIds(playlistIds)
      .getMany();
  }

  async findPlaylistByPermalink(userId: string, permalink: string) {
    const playlist = await this.playlistRepository.findPlaylistByPermalink(
      userId,
      permalink,
    );
    const user = await this.userRepository.findUserById(playlist.userId);
    return { ...playlist, user };
  }

  async updatePlaylistInfo(
    playlistId: number,
    updatePlaylistDto: UpdatePlaylistDto,
  ) {
    const updatedPlaylist = await this.playlistRepository.updatePlaylistInfo(
      playlistId,
      updatePlaylistDto,
    );
    const user = await this.userRepository.findUserById(updatedPlaylist.userId);
    return { ...updatedPlaylist, user };
  }

  async addMusicToPlaylist(playlistId: number, musicIds: number[]) {
    const musics = await this.musicRepository.findMusicByIds(musicIds);
    return this.playlistRepository.addMusicToPlaylist(playlistId, musics);
  }

  async deleteMusic(playlistId: number, musicIds: number[]) {
    return this.playlistRepository.deleteMusic(playlistId, musicIds);
  }

  async deletePlaylist(playlistId: number, user: User) {
    return this.playlistRepository.deletePlaylist(playlistId, user);
  }

  async findDetailPlaylistsById(id: number, pagingDto: PagingDto) {
    return this.playlistRepository.findDetailPlaylistsById(id, pagingDto);
  }

  async findPlaylistsByUserId(userId: string, pagingDto: PagingDto) {
    return this.playlistRepository.findPlaylistsByUserId(userId, pagingDto);
  }
}
