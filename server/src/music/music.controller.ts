import { JwtAuthGuard } from './../auth/guards/jwt-auth.guard';
import { IMusicData, IMusicMetadata } from './../entities/music.entity';
import { User } from 'src/entities/user.entity';
import { EntityStatusValidationPipe } from '../entities/pipes/entity-status-validation.pipe';
import { MusicService } from './music.service';
import {
  BadRequestException,
  Bind,
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { Music } from 'src/entities/music.entity';
import { GetUser } from 'src/decorators/get-user.decorator';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { extname } from 'path';
import { EntityStatus } from 'src/entities/common.types';

interface IUploadData {
  musicData: IMusicData;
  metadata: IMusicMetadata;
}

@Controller('music')
export class MusicController {
  constructor(private musicService: MusicService) {}
  private logger = new Logger('MusicController');

  @Get('/')
  async getAllMusic() {
    const musics = await this.musicService.getAllMusic();
    return { musics };
  }

  @Post('/upload')
  @UseGuards(JwtAuthGuard)
  @Bind(UploadedFiles(), GetUser())
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'music', maxCount: 1 },
      { name: 'cover', maxCount: 1 },
      { name: 'data', maxCount: 1 },
    ]),
  )
  async uploadMusic(
    files: {
      music?: Express.Multer.File[];
      cover?: Express.Multer.File[];
      data?: Express.Multer.File[];
    },
    user: User,
  ) {
    const { music, cover, data } = files;
    if (!music || !data) {
      throw new BadRequestException("Can't find music file");
    }
    const musicFile = music[0];
    const coverImage = !cover ? undefined : cover[0];
    const { musicData, metadata }: IUploadData = JSON.parse(
      files.data[0].buffer.toString(),
    )[0];

    const fileBase = `${Date.now()}_${user.id}_`;

    const uploadMusicFile = this.musicService.changeMusicMetadata(
      musicFile,
      metadata,
      coverImage,
    );

    let coverUrl: string | undefined;

    if (coverImage) {
      coverUrl = this.musicService.uploadFileDisk(
        coverImage,
        `${fileBase}cover${extname(coverImage.originalname)}`,
        'cover',
      );
    }

    const { filename, link } = await this.musicService.uploadFileFirebase(
      uploadMusicFile,
      fileBase + uploadMusicFile.originalname,
    );

    const createMusicData = {
      ...musicData,
      filename,
      link,
      cover: coverUrl,
      metadata,
    };

    const dbMusic = await this.musicService.createMusic(createMusicData, user);

    return { music: dbMusic };
  }

  @Get('/:id')
  getMusicById(@Param('id', ParseIntPipe) id: number): Promise<Music> {
    return this.musicService.getMusicById(id);
  }

  @Get('/:userId/:permalink')
  getMusicByPermalink(
    @Param('userId') userId: string,
    @Param('permalink') permalink: string,
  ): Promise<Music> {
    return this.musicService.findMusicByPermalink(userId, permalink);
  }

  @Delete('/:id')
  @UseGuards(JwtAuthGuard)
  deleteMusic(
    @Param('id', ParseIntPipe) id: number,
    @GetUser() user: User,
  ): Promise<void> {
    return this.musicService.deleteMusic(id, user);
  }

  @Patch('/:id/status')
  @UseGuards(JwtAuthGuard)
  updateMusicStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body('status', EntityStatusValidationPipe) status: EntityStatus,
  ) {
    return this.musicService.updateMusicStatus(id, status);
  }

  @Patch('/:id/count')
  updateMusicCount(@Param('id', ParseIntPipe) id: number) {
    return this.musicService.updateMusicCount(id);
  }
}
