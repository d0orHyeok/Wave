import { User } from 'src/entities/user.entity';
import { AuthGuard } from '@nestjs/passport';
import { MusicStatusValidationPipe } from './pipes/music-status-validation.pipe';
import { CreateMusicDto } from './dto/create-music.dto';
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
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { Music, MusicStatus } from 'src/entities/music.entity';
import { GetUser } from 'src/decorators/get-user.decorator';

@Controller('music')
@UseGuards(AuthGuard())
export class MusicController {
  constructor(private musicService: MusicService) {}
  private logger = new Logger('MusicController');

  @Get('/')
  getAllMusic(): Promise<Music[]> {
    return this.musicService.getAllMusic();
  }

  @Post('/')
  @UsePipes(ValidationPipe)
  createMusic(
    @Body() createMusicDto: CreateMusicDto,
    @GetUser() user: User,
  ): Promise<Music> {
    this.logger.verbose(
      `User ${
        user.username
      } trying to create new music. Payload: ${JSON.stringify(createMusicDto)}`,
    );
    return this.musicService.createMusic(createMusicDto, user);
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
