import { ConfigService } from '@nestjs/config';
import { User } from 'src/entities/user.entity';
import { IMusicMetadata, IMusicData } from './../entities/music.entity';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MusicRepository } from 'src/music/music.repository';
import { Music, MusicStatus } from 'src/entities/music.entity';
import { getStorage } from 'firebase-admin/storage';
import { existsSync, mkdirSync, writeFileSync } from 'fs';
import * as NodeID3 from 'node-id3';
import * as uuid from 'uuid';

@Injectable()
export class MusicService {
  constructor(
    @InjectRepository(MusicRepository)
    private config: ConfigService,
    private musicRepository: MusicRepository,
  ) {}

  async getAllMusic(): Promise<Music[]> {
    return this.musicRepository.getAllMusic();
  }

  async createMusic(createMusicData: IMusicData, user: User): Promise<Music> {
    return this.musicRepository.createMusic(createMusicData, user);
  }

  changeMusicMetadata(
    file: Express.Multer.File,
    metadata: IMusicMetadata,
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

  async getMusicById(id: number): Promise<Music> {
    return this.musicRepository.getMusicById(id);
  }

  async deleteMusic(id: number, user: User): Promise<void> {
    return this.musicRepository.deleteMusic(id, user);
  }

  async updateMusicStatus(id: number, status: MusicStatus): Promise<Music> {
    return this.musicRepository.updateMusicStatus(id, status);
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
      throw new InternalServerErrorException(
        'Failed to upload file on firebase\n' + error,
      );
    }
  }

  uploadFileDisk(
    file: Express.Multer.File,
    fileName: string,
    filePath?: string,
  ) {
    const defaultPath = 'uploads';
    const uploadPath = !filePath ? defaultPath : `${defaultPath}/${filePath}`;

    if (!existsSync(uploadPath)) {
      mkdirSync(uploadPath);
    }

    const uploadFile = `${__dirname}/../../${uploadPath}/${fileName}`;
    writeFileSync(uploadFile, file.buffer); // file.path 임시 파일 저장소

    return `${uploadPath}/${fileName}`;
  }

  async updateMusicCount(id: number) {
    return this.musicRepository.updateMusicCount(id);
  }

  async test() {
    const bucket = getStorage().bucket();
    const file = bucket.file(
      'Crush - Endorphin (Feat. Penomeco, Punchnello).mp3',
    );

    const data = await file.get();
    console.log(data);
  }
}
