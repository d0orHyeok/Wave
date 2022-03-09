import axios, { AxiosInstance } from 'axios'

axios.defaults.baseURL = process.env.NODE_ENV === 'development' ? '/' : `${process.env.REACT_APP_API_URL}`
axios.defaults.withCredentials = true

export const Axios: AxiosInstance = axios.create({
  // 기본 서버 주소
  baseURL: (axios.defaults.baseURL = process.env.NODE_ENV === 'development' ? '/' : `${process.env.REACT_APP_API_URL}`),
})
