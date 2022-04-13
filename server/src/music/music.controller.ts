import { IMusicData, IMusicMetadata } from './../entities/music.entity';
import { User } from 'src/entities/user.entity';
import { AuthGuard } from '@nestjs/passport';
import { MusicStatusValidationPipe } from './pipes/music-status-validation.pipe';
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
import { Music, MusicStatus } from 'src/entities/music.entity';
import { GetUser } from 'src/decorators/get-user.decorator';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { extname } from 'path';

interface IUploadData {
  musicData: IMusicData;
  metadata: IMusicMetadata;
}

@Controller('music')
@UseGuards(AuthGuard())
export class MusicController {
  constructor(private musicService: MusicService) {}
  private logger = new Logger('MusicController');

  @Get('/')
  getAllMusic(): Promise<Music[]> {
    return this.musicService.getAllMusic();
  }

  @Post('/upload')
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

    const fileBase = `${Date.now()}_${user.permaId}_`;

    const uploadMusicFile = this.musicService.changeMusicMetadata(
      musicFile,
      metadata,
    );

    let coverUrl: string | undefined;

    if (coverImage) {
      coverUrl = this.musicService.uploadFileDisk(
        coverImage,
        `${fileBase}${extname(coverImage.originalname)}`,
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

  @Delete('/:id')
  deleteMusic(
    @Param('id', ParseIntPipe) id: number,
    @GetUser() user: User,
  ): Promise<void> {
    return this.musicService.deleteMusic(id, user);
  }

  @Patch('/:id/status')
  updateMusicStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body('status', MusicStatusValidationPipe) status: MusicStatus,
  ) {
    return this.musicService.updateMusicStatus(id, status);
  }
}
