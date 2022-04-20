import { Music } from 'src/entities/music.entity';
import {
  BaseEntity,
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';

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

  @ManyToMany(() => User, (user) => user.following)
  @JoinTable()
  followers: User[];

  @ManyToMany(() => User, (user) => user.followers)
  following: User[];

  @Column({ nullable: true })
  hashedRefreshToken: string;

  @OneToMany(() => Music, (music) => music.user, { eager: true })
  musics: Music[];
}
