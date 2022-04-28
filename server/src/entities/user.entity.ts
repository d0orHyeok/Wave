import { Playlist } from './playlist.entity';
import { Like } from './like.entity';
import { Music } from 'src/entities/music.entity';
import {
  BaseEntity,
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryColumn,
  Unique,
} from 'typeorm';
import { Follow } from './follow.entity';
import ShortUniqueId from 'short-unique-id';

@Entity()
@Unique(['username'])
export class User extends BaseEntity {
  @PrimaryColumn()
  id: string;

  @Column()
  username: string;

  @Column()
  password: string;

  @Column()
  email: string;

  @Column({ nullable: true })
  nickname: string;

  @Column({ nullable: true })
  profileImage: string;

  @OneToMany(() => Like, (like) => like.user)
  likes: Like[];

  @OneToMany(() => Follow, (follow) => follow.follower)
  followers: Follow[];

  @OneToMany(() => Follow, (follow) => follow.following)
  following: Follow[];

  @Column({ nullable: true })
  hashedRefreshToken: string;

  @OneToMany(() => Music, (music) => music.user, { eager: true })
  musics: Music[];

  @OneToMany(() => Playlist, (playlist) => playlist.user, { eager: true })
  playlists: Playlist[];

  @CreateDateColumn()
  createdAt: Date;

  @BeforeInsert()
  generateId() {
    const uid = new ShortUniqueId({ length: 12 });
    this.id = uid();
  }
}
