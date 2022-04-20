import { IsNumber } from 'class-validator';

export class AuthLikesDto {
  @IsNumber()
  musicId: number;
}
