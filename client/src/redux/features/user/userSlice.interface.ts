import { IMusic, IPlaylist } from '../player/palyerSlice.interface'

type UserId = string

export interface IUserData {
  id: UserId
  username: string
  email: string
  nickname?: string
  profileImage?: string
  description?: string
  musics: IMusic[]
  likeMusics: IMusic[]
  repostMusics: IMusic[]
  followers: IUserData[]
  following: IUserData[]
  playlists: IPlaylist[]
  createdAt: string
}

export interface IUserState {
  isLogin: boolean
  userData?: IUserData
}

export interface IUserRegisterBody {
  username: string
  password: string
  email: string
  nickanem?: string
}

export interface IUserLoginBody {
  username: string
  password: string
}

export interface IUserUpdatePlaylistMusicsParams {
  playlistId: number | string
  musicIds: number[]
}
