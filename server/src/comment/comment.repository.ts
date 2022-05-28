import { EntityRepository, Repository } from 'typeorm';
import { Comment } from 'src/entities/comment.entity';
import { User } from 'src/entities/user.entity';
import { CreateCommentDto } from './dto/create-comment.dto';
import { Music } from 'src/entities/music.entity';
import {
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';

@EntityRepository(Comment)
export class CommentRepository extends Repository<Comment> {
  async createComment(
    user: User,
    music: Music,
    createCommentDto: CreateCommentDto,
  ) {
    const { text, commentedAt } = createCommentDto;
    const comment = this.create({ user, music, text, commentedAt });

    try {
      await this.save(comment);
      return comment;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(
        error,
        `Error ocuur create music.`,
      );
    }
  }

  async deleteComment(commentId: number) {
    try {
      const result = await this.delete({ id: commentId });
      if (result.affected === 0) {
        throw new NotFoundException(`Can't find Playlist with id ${commentId}`);
      }
    } catch (error) {
      throw new InternalServerErrorException(error, 'Error to delete playlist');
    }
  }
}
