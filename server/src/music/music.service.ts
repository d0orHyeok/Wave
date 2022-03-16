import { User } from 'src/entities/user.entity';
import { CreateMusicDto } from './dto/create-music.dto';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MusicRepository } from 'src/music/music.repository';
import { Music, MusicStatus } from 'src/entities/music.entity';

@Injectable()
export class MusicService {
  constructor(
    @InjectRepository(MusicRepository)
    private musicRepository: MusicRepository,
  ) {}

  async getAllMusic(): Promise<Music[]> {
    return this.musicRepository.getAllMusic();
  }

  async createMusic(
    createMusicDto: CreateMusicDto,
    user: User,
  ): Promise<Music> {
    return this.musicRepository.createMusic(createMusicDto, user);
  }

  async getMusicById(id: number): Promise<Music> {
    return this.musicRepository.getMusicById(id);
  }

  async deleteMusic(id: number, user: User): Promise<void> {
    return this.musicRepository.deleteMusic(id, user);
  }

  async updateMusicStatus(id: number, status: MusicStatus): Promise<Music> {
    return this.musicRepository.updateMusicStatus(id, status);
  }
}
