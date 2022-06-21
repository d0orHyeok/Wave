import { IMusic } from '@appTypes/music.type'

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
  currentTime: number
  currentStringTime: string
  durationStringTime: string
}

export interface IProgressPayload {
  percent?: number
  duration?: number
  currentTime?: number
  currentStringTime?: string
  durationStringTime?: string
}
