import { IsNumber, IsOptional } from 'class-validator';

export class MusicPagingDto {
  @IsOptional()
  @IsNumber()
  take?: number;

  @IsOptional()
  @IsNumber()
  skip?: number;
}
