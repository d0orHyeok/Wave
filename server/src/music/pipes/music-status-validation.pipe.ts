import { MusicStatus } from 'src/entities/music.entity';
import { BadRequestException, PipeTransform } from '@nestjs/common';

export class MusicStatusValidationPipe implements PipeTransform {
  readonly StatusOptions = [MusicStatus.PRIVATE, MusicStatus.PUBLIC];

  transform(value: any) {
    value = value.toUpperCase();

    if (!this.isStatusValid(value)) {
      throw new BadRequestException(`${value} is not in the status options`);
    }
  }

  private isStatusValid(status: any) {
    const index = this.StatusOptions.indexOf(status);
    return index !== -1;
  }
}
