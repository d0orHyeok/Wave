export interface IUserData {
  username: string
  email: string
  nickname?: string
  image?: string
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
