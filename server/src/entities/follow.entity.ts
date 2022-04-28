import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity()
export class Follow {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'followingId', nullable: true })
  followingId: number;

  @Column({ name: 'followerId', nullable: true })
  followerId: number;

  @ManyToOne(() => User, (user) => user.following, {
    cascade: true,
    eager: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'followingId', referencedColumnName: 'id' })
  following: User;

  @ManyToOne(() => User, (user) => user.followers, {
    cascade: true,
    eager: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'followerId', referencedColumnName: 'id' })
  follower: User;

  @CreateDateColumn()
  createdAt: Date;
}
