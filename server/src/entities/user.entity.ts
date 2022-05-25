import { Playlist } from './playlist.entity';
import { Music } from 'src/entities/music.entity';
import {
  BaseEntity,
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryColumn,
  Unique,
} from 'typeorm';
import ShortUniqueId from 'short-unique-id';

@Entity()
@Unique(['username'])
export class User extends BaseEntity {
  @PrimaryColumn()
  id: string;

  @Column()
  username: string;

  @Column({ select: false })
  password: string;

  @Column()
  email: string;

  @Column({ nullable: true })
  nickname: string;

  @Column({ nullable: true })
  profileImage: string;

  @Column({ nullable: true })
  description: string;

  @ManyToMany(() => Music, (music) => music.likes, { cascade: true })
  @JoinTable()
  likeMusics: Music[];

  @ManyToMany(() => Music, (music) => music.reposts, { cascade: true })
  @JoinTable()
  repostMusics: Music[];

  @ManyToMany(() => User, (user) => user.following)
  followers: User[];

  @ManyToMany(() => User, (user) => user.followers)
  @JoinTable()
  following: User[];

  @Column({ nullable: true, select: false })
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
