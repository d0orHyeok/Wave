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
  musicsCount: number
  likeMusics: IMusic[]
  repostMusics: IMusic[]
  followers: IUserData[]
  following: IUserData[]
  followersCount: number
  followingCount: number
  playlists: IPlaylist[]
  createdAt: string
}

export interface IUserState {
  isLogin: boolean
  userData?: IUserData
}
