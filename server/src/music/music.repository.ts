import { User } from 'src/entities/user.entity';
import { NotFoundException } from '@nestjs/common';
import { IMusicData, Music, MusicStatus } from 'src/entities/music.entity';
import { EntityRepository, Repository } from 'typeorm';

@EntityRepository(Music)
export class MusicRepository extends Repository<Music> {
  async getAllMusic(): Promise<Music[]> {
    return this.find();
  }

  async createMusic(createMusicData: IMusicData, user: User): Promise<Music> {
    const { permalink } = createMusicData;

    const existMusics = await this.find({ id: user.id, permalink });

    const music = this.create({
      ...createMusicData,
      permalink: !existMusics.length ? permalink : `${permalink}${Date.now()}`,
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
