export interface IUserData {
  username: string
  email: string
  nickname?: string
  image?: string
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
