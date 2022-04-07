export interface IUserData {
  id: number
  username: string
  email: string
  nickname?: string
  profileImage?: string
  permaId: string
  musics: string[]
}

interface TempState {
  isLike: boolean
  isFollow: boolean
}

export interface IUserState extends TempState {
  isLogin: boolean
  accessToken?: string | null
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
