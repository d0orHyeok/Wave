import { EntityRepository, Repository } from 'typeorm';
import { User } from 'src/entities/user.entity';
import { Music } from 'src/entities/music.entity';
import {
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { History } from 'src/entities/history.entity';

@EntityRepository(History)
export class HistoryRepository extends Repository<History> {
  getDetailQuery() {
    return this.createQueryBuilder('history')
      .leftJoinAndSelect('history.user', 'user')
      .leftJoinAndSelect('history.music', 'music');
  }

  async findHistorysByUserId(userId: string) {
    try {
      return this.getDetailQuery()
        .where('history.userId = :userId', {
          userId,
        })
        .getMany();
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(error, 'Error to get history');
    }
  }

  async createHistory(user: User, music: Music) {
    const history = this.create({ user, music });

    try {
      await this.save(history);
      return history;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(
        error,
        `Error ocuur create history.`,
      );
    }
  }

  async deleteHistory(historyId: number) {
    try {
      const result = await this.delete({ id: historyId });
      if (result.affected === 0) {
        throw new NotFoundException(`Can't find history with id ${historyId}`);
      }
    } catch (error) {
      throw new InternalServerErrorException(error, 'Error to delete history');
    }
  }
}
