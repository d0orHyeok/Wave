import { User } from 'src/entities/user.entity';
import { NotFoundException } from '@nestjs/common';
import { Music, MusicStatus } from 'src/entities/music.entity';
import { EntityRepository, Repository } from 'typeorm';
import { CreateMusicDto } from './dto/create-music.dto';

@EntityRepository(Music)
export class MusicRepository extends Repository<Music> {
  async getAllMusic(): Promise<Music[]> {
    return this.find();
  }

  async createMusic(
    createMusicDto: CreateMusicDto,
    user: User,
  ): Promise<Music> {
    const { title, description } = createMusicDto;

    const music = this.create({
      title,
      description,
      user,
    });
    await this.save(music);

    return music;
  }

  async getMusicById(id: number): Promise<Music> {
    const music = await this.findOne(id);

    if (!music) {
      throw new NotFoundException(`Can't find Music with id ${id}`);
    }

    return music;
  }

  async deleteMusic(id: number, user: User): Promise<void> {
    const result = await this.delete({ id, user });

    if (result.affected === 0) {
      throw new NotFoundException(`Can't find Music with id ${id}`);
    }
  }

  async updateMusicStatus(id: number, status: MusicStatus): Promise<Music> {
    const board = await this.getMusicById(id);

    board.status = status;
    await this.save(board);

    return board;
  }
}
