import Axios from './Axios'

export const getUserById = (userId: string) => {
  return Axios.get(`/api/auth/${userId}`)
}
