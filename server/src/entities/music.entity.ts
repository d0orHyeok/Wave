import { User } from 'src/entities/user.entity';
import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

export enum MusicStatus {
  PUBLIC = 'PUBLIC',
  PRIVATE = 'PRIVATE',
}

export interface IMusicMetadata {
  title: string;
  genre?: string;
  description?: string;
  artist?: string;
  album: string;
  albumartist?: string;
  composer?: string;
  year?: string;
  lyrics?: string;
}

export interface IMusicData {
  title: string;
  permalink: string;
  filename: string;
  link: string;
  genre?: string;
  description?: string;
  tags?: string[];
  cover?: string;
  status: MusicStatus;
  metaData?: IMusicMetadata;
}

// permalink: string
//   genre?: string
//   description?: string
//   tags?: string[]

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

  @Column('simple-json', { nullable: true })
  metadata: IMusicMetadata;

  @Column()
  status: MusicStatus;

  @ManyToOne(() => User, (user) => user.musics, { onDelete: 'SET NULL' })
  user: User;
}
