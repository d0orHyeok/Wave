import { EntityStatus } from './../../entities/common.types';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdatePlaylistDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  permalink: string;

  @IsOptional()
  @IsString({ each: true })
  tags: string[];

  @IsOptional()
  @IsString()
  description: string;

  @IsOptional()
  @IsString()
  status: EntityStatus;
}
