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
