export interface IPlayerState {
  currentMusic: null | IMusic
  musics: IMusic[]
  indexing: IIndexing
  controll: IControll
  progress: IProgress
}

export interface IIndexing {
  currentIndex: number
  indexArray: number[]
}

export interface IControll {
  isPlay: boolean
  isShuffle: boolean
  repeat?: 'one' | 'all'
}

export interface IProgress {
  percent: number
  duration: number
  currentStringTime: string
  durationStringTime: string
}

export interface IProgressPayload {
  percent?: number
  duration?: number
  currentStringTime?: string
  durationStringTime?: string
}

import { IUserData } from '../user/userSlice.interface'

export enum MusicStatus {
  PUBLIC = 'PUBLIC',
  PRIVATE = 'PRIVATE',
}

export interface IMusicMetadata {
  title: string
  genre?: string
  description?: string
  artist?: string
  album: string
  albumartist?: string
  composer?: string
  year?: string
  lyrics?: string
}

export interface IMusic {
  id: number
  title: string
  permalink: string
  filename: string
  link: string
  genre?: string
  description?: string
  tags?: string[]
  cover?: string
  status: MusicStatus
  metaData: IMusicMetadata
  userId: number
  user?: IUserData
}
