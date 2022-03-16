import { IsNotEmpty } from 'class-validator';

export class CreateMusicDto {
  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  description: string;
}
