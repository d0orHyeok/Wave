import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  Column,
} from 'typeorm';
import { User } from './user.entity';

@Entity()
export class Follow {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  followingId: number;

  @Column({ nullable: true })
  followerId: number;

  @ManyToOne(() => User, (user) => user.following, {
    cascade: true,
    eager: true,
  })
  @JoinColumn({ name: 'followingId', referencedColumnName: 'id' })
  following: User;

  @ManyToOne(() => User, (user) => user.followers, {
    cascade: true,
    eager: true,
  })
  @JoinColumn({ name: 'followerId', referencedColumnName: 'id' })
  follower: User;
}
