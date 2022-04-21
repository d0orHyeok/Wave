import { EntityRepository, Repository } from 'typeorm';
import { Follow } from 'src/entities/follow.entity';
import { User } from 'src/entities/user.entity';
import { NotFoundException } from '@nestjs/common';

@EntityRepository(Follow)
export class FollowRepository extends Repository<Follow> {
  async createFollow(user: User, following: User) {
    const follow = this.create({ follower: user, following });
    const existFollow = await this.findOne(follow);
    if (existFollow) return null;
    await this.save(follow);
  }

  async deleteFollow(user: User, following: User) {
    const result = await this.delete({
      followerId: user.id,
      followingId: following.id,
    });

    if (result.affected === 0) {
      throw new NotFoundException(`Failed to unfollow`);
    }
  }

  async getFollow(user: User) {
    const wers = await this.find({ followingId: user.id });
    const ing = await this.find({ followerId: user.id });

    const followers = wers.map((u) => {
      return {
        id: u.follower.id,
        name: u.follower.nickname,
        image: u.follower.profileImage,
      };
    });
    const following = ing.map((u) => {
      return {
        id: u.following.id,
        name: u.following.nickname,
        image: u.following.profileImage,
      };
    });

    return { followers, following };
  }
}
