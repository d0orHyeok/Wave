import { PlaylistMusic } from './playlistMusic.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  Column,
  CreateDateColumn,
  OneToMany,
  JoinColumn,
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

  @Column()
  image: string;

  @Column({ nullable: true })
  description: string;

  @Column('text', { array: true, nullable: true, default: [] })
  tags: string[];

  @Column({ default: EntityStatus.PUBLIC })
  status: EntityStatus;

  @CreateDateColumn()
  createdAt: Date;

  @Column({ name: 'userId', nullable: true })
  userId: string;

  @ManyToOne(() => User, (user) => user.playlists, {
    cascade: true,
    onDelete: 'CASCADE',
    nullable: true,
  })
  @JoinColumn([{ name: 'userId', referencedColumnName: 'id' }])
  user: User;

  @OneToMany(() => PlaylistMusic, (playlistMusic) => playlistMusic.playlist)
  playlistMusics: PlaylistMusic[];
}
