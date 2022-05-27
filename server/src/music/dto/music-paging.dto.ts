import { IsNumber, IsOptional } from 'class-validator';
import { UploadMusicDataDto } from './upload-music-data.dto';

export class MusicPagingDto extends UploadMusicDataDto {
  @IsOptional()
  @IsNumber()
  take?: number;

  @IsOptional()
  @IsNumber()
  skip?: number;
}
