import { MusicRepository } from './../music/music.repository';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { UserRepository } from 'src/auth/user.repository';
import { PlaylistController } from './playlist.controller';
import { PlaylistRepository } from './playlist.repository';
import { PlaylistService } from './playlist.service';
import { PlaylistMusicRepository } from './playlistMusic.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      PlaylistRepository,
      PlaylistMusicRepository,
      UserRepository,
      MusicRepository,
    ]),
    AuthModule,
  ],
  controllers: [PlaylistController],
  providers: [PlaylistService],
})
export class PlaylistModule {}
