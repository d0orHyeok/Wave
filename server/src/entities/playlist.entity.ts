import { Music } from 'src/entities/music.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  Column,
  CreateDateColumn,
  JoinColumn,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { User } from './user.entity';
import { EntityStatus } from './common.types';

@Entity()
export class Playlist {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  permalink: string;

  @Column({ nullable: true })
  image: string;

  @Column({ nullable: true })
  description: string;

  @Column('text', { array: true, nullable: true })
  tags: string[];

  @Column({ default: EntityStatus.PUBLIC })
  status: EntityStatus;

  @Column({ nullable: true, name: 'userId' })
  userId: string;

  @ManyToOne(() => User, (user) => user.playlists, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'userId', referencedColumnName: 'id' })
  user: User;

  @ManyToMany(() => Music, (music) => music.playlists, {
    eager: true,
    cascade: true,
    onDelete: 'CASCADE',
  })
  @JoinTable()
  musics: Music[];

  @CreateDateColumn()
  createdAt: Date;
}
