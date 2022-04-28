import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';
import { Music } from './music.entity';
import { User } from './user.entity';

@Entity()
export class Like {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'userId', nullable: true })
  userId: number;

  @Column({ name: 'musicId', nullable: true })
  musicId: number;

  @ManyToOne(() => User, (user) => user.likes, {
    cascade: true,
    eager: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'userId', referencedColumnName: 'id' })
  user: User;

  @ManyToOne(() => Music, (music) => music.likes, {
    cascade: true,
    eager: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'musicId', referencedColumnName: 'id' })
  music: Music;

  @CreateDateColumn()
  createdAt: Date;
}
