import { MusicMetadataDto } from './../music/dto/music-metadata.dto';
import { PlaylistMusic } from './playlistMusic.entity';
import { Like } from './like.entity';
import { User } from 'src/entities/user.entity';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
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

  @Column({ unique: true })
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

  @Column('simple-json')
  metadata: MusicMetadataDto;

  @Column({ default: EntityStatus.PUBLIC })
  status: EntityStatus;

  @Column({ default: 0 })
  count: number;

  @Column({ nullable: true, name: 'userId' })
  userId: string;

  @OneToMany(() => Like, (like) => like.music)
  likes: Like[];

  @OneToMany(() => PlaylistMusic, (playlistMusic) => playlistMusic.music)
  playlistMusics: PlaylistMusic[];

  @ManyToOne(() => User, (user) => user.musics, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'userId', referencedColumnName: 'id' })
  user: User;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
