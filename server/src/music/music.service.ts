import { MusicPagingDto } from './dto/music-paging.dto';
import { AuthService } from './../auth/auth.service';
import { MusicMetadataDto } from './dto/music-metadata.dto';
import { MusicDataDto } from './dto/music-data.dto';
import { ConfigService } from '@nestjs/config';
import { User } from 'src/entities/user.entity';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MusicRepository } from 'src/music/music.repository';
import { Music } from 'src/entities/music.entity';
import { getStorage } from 'firebase-admin/storage';
import * as NodeID3 from 'node-id3';
import * as uuid from 'uuid';
import { EntityStatus } from 'src/entities/common.types';
import { Brackets } from 'typeorm';

@Injectable()
export class MusicService {
  constructor(
    @InjectRepository(MusicRepository)
    private config: ConfigService,
    private musicRepository: MusicRepository,
    private authService: AuthService,
  ) {}

  async getAllMusic(): Promise<Music[]> {
    return this.musicRepository.getAllMusic();
  }

  async createMusic(createMusicData: MusicDataDto, user: User): Promise<Music> {
    return this.musicRepository.createMusic(createMusicData, user);
  }

  changeMusicMetadata(
    file: Express.Multer.File,
    metadata: MusicMetadataDto,
    image?: Express.Multer.File,
  ) {
    const { description, lyrics } = metadata;

    let tags: any = {
      title: metadata.title,
      genre: metadata.genre,
      artist: metadata.artist,
      album: metadata.album,
      performerInfo: metadata.albumartist,
      composer: metadata.composer,
      year: metadata.year,
    };

    if (image) {
      tags = {
        ...tags,
        image: {
          type: { id: 3, name: 'front cover' },
          mime: image.mimetype,
          description: 'album cover',
          imageBuffer: image.buffer,
        },
      };
    }

    if (lyrics) {
      tags = {
        ...tags,
        unsynchronisedLyrics: {
          language: 'kor',
          text: lyrics,
        },
      };
    }

    if (description) {
      tags = {
        ...tags,
        comment: {
          language: 'kor',
          text: description,
        },
      };
    }

    const newBuffer = NodeID3.update(tags, file.buffer);

    return !newBuffer ? file : { ...file, buffer: newBuffer };
  }

  async findMusicById(id: number) {
    const music = await this.musicRepository.findMusicById(id);
    const user = await this.authService.findUserById(music.userId);
    return { ...music, user };
  }

  async findMusicByPermalink(userId: string, permalink: string) {
    const music = await this.musicRepository.findMusicByPermalink(
      userId,
      permalink,
    );
    const user = await this.authService.findUserById(music.userId);
    return { ...music, user };
  }

  async deleteMusic(id: number, user: User): Promise<void> {
    const music = await this.musicRepository.findOne({ id, user });
    if (music) {
      const { filename } = music;
      await this.deleteFileFirebase(filename);
      return this.musicRepository.deleteMusic(id, user);
    }
  }

  createPersistentDownloadUrl = (pathToFile, downloadToken) => {
    const bucket = 'wave-f1616.appspot.com';
    return `https://firebasestorage.googleapis.com/v0/b/${bucket}/o/${encodeURIComponent(
      pathToFile,
    )}?alt=media&token=${downloadToken}`;
  };

  async uploadFileFirebase(file: Express.Multer.File, filename: string) {
    const bucket = getStorage().bucket();
    const upload = bucket.file(filename);

    try {
      await upload.save(file.buffer, {
        contentType: file.mimetype,
      });

      const dowloadToken = uuid.v4();

      await upload.setMetadata({
        metadata: { firebaseStorageDownloadTokens: dowloadToken },
      });

      return {
        filename,
        link: this.createPersistentDownloadUrl(filename, dowloadToken),
      };
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(
        'Failed to upload file on firebase\n' + error,
      );
    }
  }

  async updateMusicStatus(id: number, status: EntityStatus): Promise<Music> {
    return this.musicRepository.updateMusicStatus(id, status);
  }

  async updateMusicCount(id: number) {
    return this.musicRepository.updateMusicCount(id);
  }

  async deleteFileFirebase(filename: string) {
    const bucket = getStorage().bucket();
    await bucket.file(filename).delete();
  }

  async findRelatedMusic(id: number, musicPagingDto: MusicPagingDto) {
    // 선택된 음악의 제목, 앨범, 아티스트와 관련있는 음악들을 가져온다
    const music = await this.musicRepository.findMusicById(id);

    const { title, album, artist } = music.metadata;
    const { skip, take } = musicPagingDto;

    return this.musicRepository
      .musicSimpleQuery()
      .where('music.id != :id', { id: music.id })
      .andWhere(
        new Brackets((qb) => {
          let query = qb.where('music.title LIKE :title', {
            title: `%${title}%`,
          });
          if (album && album.length) {
            query = query.orWhere('music.album LIKE :album', {
              album: `%${album}%`,
            });
          }
          if (artist && artist.length) {
            query = query.orWhere(`music.metadata->>'artist' LIKE :artist`, {
              artist: `%${artist}%`,
            });
          }
          return query;
        }),
      )
      .skip(skip ? skip : 0)
      .take(take ? take : 10)
      .getMany();
  }
}
