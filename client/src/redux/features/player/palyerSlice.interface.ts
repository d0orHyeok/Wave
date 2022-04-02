export interface IPlayerState {
  list: IList
  controll: IControll
  progress: IProgress
}

export interface IMusic {
  title: string
  name: string
  artist: string
}

export interface IList {
  musics: IMusic[]
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
