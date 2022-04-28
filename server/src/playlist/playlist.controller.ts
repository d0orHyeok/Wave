import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { GetUser } from 'src/decorators/get-user.decorator';
import { User } from 'src/entities/user.entity';
import { CreatePlaylistDto } from './dto/createPlaylistDto';
import { PlaylistService } from './playlist.service';

@Controller('playlist')
export class PlaylistController {
  constructor(private playlistService: PlaylistService) {}

  @Post('/create')
  @UseGuards(JwtAuthGuard)
  async createPlaylist(
    @GetUser() user: User,
    @Body(ValidationPipe) createPlaylistDto: CreatePlaylistDto,
  ) {
    return this.playlistService.createPlaylist(user, createPlaylistDto);
  }

  @Get('/:userId/:permalink')
  async getPlaylist(
    @Param('userId') userId: string,
    @Param('permalink') permalink: string,
  ) {
    const playlist = await this.playlistService.findPlaylistByPermalink(
      userId,
      permalink,
    );
    return this.playlistService.getPlaylistData(playlist);
  }

  @Post('/:id/add')
  async createPlaylistMusics(
    @Param('id', ParseIntPipe) id: number,
    @Body('musicIds') musicIds: number[],
  ) {
    const playlist = await this.playlistService.findPlaylistById(id);
    return this.playlistService.addMusics(playlist, musicIds);
  }

  @Put('/:id/:musicId')
  async deletePlaylistMusic(
    @Param('id', ParseIntPipe) id: number,
    @Param('musicId', ParseIntPipe) musicId: number,
  ) {
    return this.playlistService.deleteMusic(id, musicId);
  }

  @Delete('/:id')
  @UseGuards(JwtAuthGuard)
  async deletePlaylist(
    @GetUser() user: User,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.playlistService.deletePlaylist(id, user);
  }
}
