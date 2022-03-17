export interface IUserData {
  username: string
  email: string
  nickname?: string
  image?: string
}

export interface IUserState {
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
