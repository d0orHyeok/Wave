import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MusicModule } from './music/music.module';
import { ConfigurationModule } from './configs/configuration.module';
import { AuthModule } from './auth/auth.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { PlaylistModule } from './playlist/playlist.module';

@Module({
  imports: [
    // .env variables
    ConfigurationModule,
    // DB Connection
    TypeOrmModule.forRoot(),
    // Serve Static file
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..'),
    }),
    MusicModule,
    AuthModule,
    PlaylistModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
