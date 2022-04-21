import { Music } from 'src/entities/music.entity';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { Follow } from './follow.entity';

@Entity()
@Unique(['username'])
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

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

  @Column()
  permaId: string;

  @Column('int', { array: true, default: [] })
  likes: number[];

  @OneToMany(() => Follow, (follow) => follow.follower)
  followers: User[];

  @OneToMany(() => Follow, (follow) => follow.following)
  following: User[];

  @Column({ nullable: true })
  hashedRefreshToken: string;

  @OneToMany(() => Music, (music) => music.user, { eager: true })
  musics: Music[];

  @CreateDateColumn()
  createdAt: Date;
}
