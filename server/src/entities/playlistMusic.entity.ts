import { Playlist } from './playlist.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  Column,
} from 'typeorm';
import { Music } from './music.entity';

@Entity()
export class PlaylistMusic {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'playlistId', nullable: true })
  playlistId: number;

  @ManyToOne(() => Playlist, (playlist) => playlist.playlistMusics, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'playlistId', referencedColumnName: 'id' })
  playlist: Playlist;

  @Column({ name: 'musicId', nullable: true })
  musicId: number;

  @ManyToOne(() => Music, (music) => music.playlistMusics, {
    cascade: true,
    eager: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'musicId', referencedColumnName: 'id' })
  music: Music;
}
