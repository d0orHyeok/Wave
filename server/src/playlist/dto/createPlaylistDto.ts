import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreatePlaylistDto {
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
  @IsNumber({}, { each: true })
  musicIds: number[];
}
