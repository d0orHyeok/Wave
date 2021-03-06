import { getBlobFromURL, getBufferFromBlob } from './../fileFunction';
import { deleteFileDisk, uploadFileDisk } from 'src/fileFunction';
import { UpdateMusicDataDto } from './dto/update-music-data.dto';
import { UploadMusicDataDto } from './dto/upload-music-data.dto';
import { PagingDto } from '../common/dto/paging.dto';
import { AuthService } from './../auth/auth.service';
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
import { extname } from 'path';

@Injectable()
export class MusicService {
  constructor(
    @InjectRepository(MusicRepository)
    private musicRepository: MusicRepository,
    private configService: ConfigService,
    private authService: AuthService,
  ) {}

  async createMusic(createMusicData: MusicDataDto, user: User): Promise<Music> {
    return this.musicRepository.createMusic(createMusicData, user);
  }

  async getAllMusic(): Promise<Music[]> {
    return this.musicRepository.getAllMusic();
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

  async findMusicsByIds(musicIds: number[]) {
    return this.musicRepository
      .musicDetailQuery()
      .whereInIds(musicIds)
      .getMany();
  }

  async findMusicsByUserId(userId: string, pagingDto: PagingDto) {
    return this.musicRepository.findMusicsByUserId(userId, pagingDto);
  }

  async findPopularMusicsByUserId(userId: string) {
    return this.musicRepository.findPopularMusicsByUserId(userId);
  }

  async findRelatedMusic(id: number, pagingDto: PagingDto) {
    // ????????? ????????? ??????, ??????, ??????????????? ???????????? ???????????? ????????????
    return this.musicRepository.findRelatedMusic(id, pagingDto);
  }

  async searchMusic(keyward: string, pagingDto: PagingDto) {
    return this.musicRepository.searchMusic(keyward, pagingDto);
  }

  async findMusicsByTag(tag: string, pagingDto: PagingDto) {
    return this.musicRepository.findMusicsByTag(tag, pagingDto);
  }

  changeMusicFileData(
    file: Express.Multer.File,
    data: UploadMusicDataDto,
    image?: Express.Multer.File,
  ) {
    const { description, lyrics } = data;

    let tags: any = {
      title: data.title,
      genre: data.genre,
      artist: data.artist,
      album: data.album,
      performerInfo: data.albumartist,
      composer: data.composer,
      year: data.year,
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

  async updateMusicData(id: number, updateMusicDataDto: UpdateMusicDataDto) {
    return this.musicRepository.updateMusicData(id, updateMusicDataDto);
  }

  async changeMusicCover(id: number, file: Express.Multer.File) {
    const music = await this.musicRepository.findMusicById(id);
    const { cover, link, filename } = music;
    const serverUrl = this.configService.get<string>('SERVER_URL');
    const fileBase = `${Date.now()}_${music.userId}_`;

    // ??????????????? ????????????
    const musicBlob = await getBlobFromURL(link);
    if (!musicBlob) {
      throw new InternalServerErrorException('Fail to update');
    }
    const musicBuffer = await getBufferFromBlob(musicBlob);

    // ????????? ??????????????? ????????? ????????????
    const tags = {
      image: {
        type: { id: 3, name: 'front cover' },
        mime: file.mimetype,
        description: 'album cover',
        imageBuffer: file.buffer,
      },
    };
    const newBuffer = NodeID3.update(tags, musicBuffer);
    if (!newBuffer) {
      throw new InternalServerErrorException('Fail to update');
    }

    // ????????? ???????????? ??????????????? ????????????.
    await this.deleteFileFirebase(filename);
    const { filename: newFilename, link: newLink } =
      await this.uploadFileFirebase(newBuffer, musicBlob.type, filename);

    // ????????? ??? ??????????????? ????????????.
    if (cover) {
      const existCoverPath = `uploads${cover.split('uploads')[1]}`;
      deleteFileDisk(existCoverPath);
    }

    // ?????? ??????????????? ????????????.
    const newCoverName = `${fileBase}_cover${extname(file.originalname)}`;
    const newCoverPath =
      serverUrl + '/' + uploadFileDisk(file, newCoverName, 'cover');

    // ?????? ?????????????????? ??????????????????.
    music.cover = newCoverPath;
    music.filename = newFilename;
    music.link = newLink;

    return this.musicRepository.updateMusic(music);
  }

  async deleteMusic(id: number, user: User): Promise<void> {
    const music = await this.musicRepository.findOne({ id, user });
    if (music) {
      const { filename, cover } = music;
      await this.deleteFileFirebase(filename);
      if (cover) {
        const path = `uploads/${cover.split('uploads')[1]}`;
        deleteFileDisk(path);
      }
      return this.musicRepository.deleteMusic(id, user);
    }
  }

  // firebase function
  createPersistentDownloadUrl = (pathToFile, downloadToken) => {
    const bucket = 'wave-f1616.appspot.com';
    return `https://firebasestorage.googleapis.com/v0/b/${bucket}/o/${encodeURIComponent(
      pathToFile,
    )}?alt=media&token=${downloadToken}`;
  };

  async uploadFileFirebase(
    buffer: Buffer,
    contentType: string,
    filename: string,
  ) {
    const bucket = getStorage().bucket();
    const upload = bucket.file(filename);

    try {
      await upload.save(buffer, {
        contentType: contentType,
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

  async deleteFileFirebase(filename: string) {
    try {
      const bucket = getStorage().bucket();
      await bucket.file(filename).delete();
    } catch (err) {
      throw new InternalServerErrorException(
        'Fail to Delete Firebase file',
        err,
      );
    }
  }
}
