import { JwtAuthGuard } from './../auth/guards/jwt-auth.guard';
import { User } from 'src/entities/user.entity';
import { EntityStatusValidationPipe } from '../entities/pipes/entity-status-validation.pipe';
import { MusicService } from './music.service';
import {
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
import { UploadedFilesPipe } from './pipes/uploaded-files.pipe';
import { UploadMusicDto } from './dto/upload-music.dto';
import { uploadFileDisk } from 'src/upload';

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
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'musics', maxCount: 1 },
      { name: 'covers', maxCount: 1 },
      { name: 'datas', maxCount: 1 },
    ]),
  )
  async uploadMusic(
    @UploadedFiles(UploadedFilesPipe)
    uploadMusicDto: UploadMusicDto,
    @GetUser()
    user: User,
  ) {
    const { music, cover, data } = uploadMusicDto;

    const fileBase = `${Date.now()}_${user.id}_`;

    const uploadMusicFile = this.musicService.changeMusicMetadata(
      music,
      data.metadata,
      cover,
    );

    let coverUrl: string | undefined;
    if (cover) {
      coverUrl = uploadFileDisk(
        cover,
        `${fileBase}cover${extname(cover.originalname)}`,
        'cover',
      );
    }

    const { filename, link } = await this.musicService.uploadFileFirebase(
      uploadMusicFile,
      fileBase + uploadMusicFile.originalname,
    );

    const createMusicData = {
      ...data,
      filename,
      link,
      cover: coverUrl,
    };

    return this.musicService.createMusic(createMusicData, user);
  }

  @Get('/:id')
  getMusicById(@Param('id', ParseIntPipe) id: number): Promise<Music> {
    return this.musicService.findMusicById(id);
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
