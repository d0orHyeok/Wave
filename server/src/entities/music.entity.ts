import { Comment } from 'src/entities/comment.entity';
import { Playlist } from 'src/entities/playlist.entity';
import { MusicMetadataDto } from './../music/dto/music-metadata.dto';
import { User } from 'src/entities/user.entity';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { EntityStatus } from './common.types';

@Entity()
export class Music extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  permalink: string;

  @Column()
  filename: string;

  @Column()
  link: string;

  @Column('float')
  duration: number;

  @Column({ nullable: true })
  cover: string;

  @Column({ nullable: true })
  album: string;

  @Column({ nullable: true })
  description: string;

  @Column({ nullable: true })
  genre: string;

  @Column('text', { array: true, nullable: true })
  tags: string[];

  @Column('json')
  metadata: MusicMetadataDto;

  @Column({ default: EntityStatus.PUBLIC })
  status: EntityStatus;

  @Column({ default: 0 })
  count: number;

  @Column({ nullable: true, name: 'userId' })
  userId: string;

  @ManyToMany(() => User, (user) => user.repostMusics)
  reposts: User[];

  @ManyToMany(() => User, (user) => user.likeMusics)
  likes: User[];

  @ManyToMany(() => Playlist, (playlist) => playlist.musics)
  playlists: Playlist[];

  @ManyToOne(() => User, (user) => user.musics, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'userId', referencedColumnName: 'id' })
  user: User;

  @OneToMany(() => Comment, (comment) => comment.music)
  comments: Comment[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
