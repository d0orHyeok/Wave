import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MusicModule } from './music/music.module';
import { ConfigurationModule } from './configs/configuration.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    // .env variables
    ConfigurationModule,
    // DB Connection
    TypeOrmModule.forRoot(),

    MusicModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
