import { IMusic } from '../player/palyerSlice.interface'

export interface IUserData {
  id: string
  username: string
  email: string
  nickname?: string
  profileImage?: string
  musics: IMusic[]
  likes: number[]
  followers: IFollowState[]
  following: IFollowState[]
  createdAt: string
}

export interface IFollowState {
  id: number
  name: string
  image: string
}

export interface IUserState {
  isLogin: boolean
  userData?: IUserData | null
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
  followerId: number
  isFollow: boolean
}
