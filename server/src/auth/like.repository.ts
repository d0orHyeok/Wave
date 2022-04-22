import { Music } from 'src/entities/music.entity';
import { EntityRepository, Repository } from 'typeorm';
import { User } from 'src/entities/user.entity';
import { NotFoundException } from '@nestjs/common';
import { Like } from 'src/entities/like.entity';

@EntityRepository(Like)
export class LikeRepository extends Repository<Like> {
  async createLike(user: User, music: Music) {
    const like = this.create({ user, music });
    const existLike = await this.findOne(like);
    if (existLike) return null;
    await this.save(like);
  }

  async deleteLike(user: User, music: Music) {
    const result = await this.delete({
      userId: user.id,
      musicId: music.id,
    });

    if (result.affected === 0) {
      throw new NotFoundException(`Failed to unLike`);
    }
  }

  async getLikes(user: User) {
    const likelist = await this.find({ userId: user.id });
    const likes = likelist.map((like) => like.musicId);

    return likes;
  }
}
