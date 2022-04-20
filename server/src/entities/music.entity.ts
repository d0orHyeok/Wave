import { User } from 'src/entities/user.entity';
import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
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
  metaData: IMusicMetadata;
}

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
  metadata: IMusicMetadata;

  @Column()
  status: MusicStatus;

  @Column({ name: 'uploader' })
  uploader: string;

  @ManyToOne(() => User, (user) => user.musics, {
    cascade: true,
    onDelete: 'SET NULL',
    nullable: true,
  })
  @JoinColumn([{ name: 'uploader', referencedColumnName: 'username' }])
  user: User;
}
