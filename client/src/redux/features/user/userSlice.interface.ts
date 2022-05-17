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
  likes: number[]
  followers: IFollowState[]
  following: IFollowState[]
  playlists: IPlaylist[]
  createdAt: string
}

export interface IFollowState {
  id: UserId
  name: string
  image: string
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

export interface IToggleMusicLikeParams {
  musicId: number
  isLike: boolean
}

export interface IToggleFollowParams {
  followerId: UserId
  isFollow: boolean
}
