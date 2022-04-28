import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsNotEmptyObject,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { EntityStatus } from 'src/entities/common.types';
import { MusicMetadataDto } from './music-metadata.dto';

export class UploadMusicDataDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  permalink: string;

  @IsNotEmpty()
  @IsNumber()
  duration: number;

  @IsOptional()
  status: EntityStatus;

  @IsNotEmptyObject()
  @Type(() => MusicMetadataDto)
  @ValidateNested()
  metadata: MusicMetadataDto;

  @IsOptional()
  @IsString()
  genre?: string;

  @IsOptional()
  @IsString({ each: true })
  tags?: string[];

  @IsOptional()
  @IsString()
  description?: string;
}
