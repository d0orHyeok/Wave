import { CreatePlaylistDto } from './dto/createPlaylistDto';
import {
  ConflictException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { User } from 'src/entities/user.entity';
import { Playlist } from './../entities/playlist.entity';
import { EntityRepository, Repository } from 'typeorm';

@EntityRepository(Playlist)
export class PlaylistRepository extends Repository<Playlist> {
  async createPlaylist(user: User, createPlaylistDto: CreatePlaylistDto) {
    const { permalink, ...playlistData } = createPlaylistDto;

    const findPlaylist = await this.findOne({ user, permalink });

    const playlist = this.create({
      ...playlistData,
      permalink: !findPlaylist ? permalink : `${permalink}_${Date.now()}`,
      user,
    });

    try {
      await this.save(playlist);
      return playlist;
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException('Existing username');
      } else {
        console.log(error);
        throw new InternalServerErrorException();
      }
    }
  }

  async findPlaylistByPermalink(userId: string, permalink: string) {
    const playlist = await this.findOne(
      { userId, permalink },
      { relations: ['user'] },
    );

    if (!playlist) {
      throw new NotFoundException(
        `Can't find ${userId}'s playlist name: ${permalink}`,
      );
    }

    return playlist;
  }

  async deletePlaylist(id: number, user: User): Promise<void> {
    const result = await this.delete({ id, user });

    if (result.affected === 0) {
      throw new NotFoundException(`Can't find Playlist with id ${id}`);
    }
  }
}
