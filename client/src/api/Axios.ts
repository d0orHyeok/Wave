import axios, { AxiosInstance } from 'axios'

const Axios: AxiosInstance = axios.create({
  baseURL:
    process.env.NODE_ENV === 'development'
      ? '/'
      : `${process.env.REACT_APP_API_URL}`,
  withCredentials: true,
})

export default Axios
