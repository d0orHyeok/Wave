import Axios from './Axios'

interface IUserRegisterBody {
  username: string
  password: string
  email: string
  nickanem?: string
}

export const userSignUp = (registerInfo: IUserRegisterBody) => {
  return Axios.post('/api/auth/signup', registerInfo)
}

export const getUserById = (userId: string) => {
  return Axios.get(`/api/auth/${userId}`)
}

export const searchUser = (keyward: string, skip = 0, take = 10) => {
  return Axios.get(`/api/auth/search/${keyward}?skip=${skip}&take=${take}`)
}
