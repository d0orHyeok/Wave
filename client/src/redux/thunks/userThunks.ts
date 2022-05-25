import Axios from '@api/Axios'

import { createAsyncThunk } from '@reduxjs/toolkit'

interface IUserRegisterBody {
  username: string
  password: string
  email: string
  nickanem?: string
}

export const userRegister = createAsyncThunk(
  'REGISTER',
  async (registerInfo: IUserRegisterBody) => {
    const response = await Axios.post('/api/auth/signup', registerInfo)
    return response
  }
)

interface IUserLoginBody {
  username: string
  password: string
}

export const userLogin = createAsyncThunk(
  'LOGIN',
  async (loginBody: IUserLoginBody) => {
    const response = await Axios.post('/api/auth/signin', loginBody)
    return response.data.accessToken
  }
)

export const userAuth = createAsyncThunk('AUTH', async () => {
  const response = await Axios.get('/api/auth/info')
  return response.data
})

export const userLogout = createAsyncThunk('LOGOUT', async () => {
  await Axios.post('/api/auth/signout')
})

export const userToggleLikeMusic = createAsyncThunk(
  'TOGGLE_LIKES',
  async (musicId: number) => {
    const response = await Axios.patch(`/api/auth/${musicId}/like`)
    return response.data
  }
)

export const userToggleFollow = createAsyncThunk(
  'TOGGLE_FOLLOW',
  async (targetId: string) => {
    const response = await Axios.patch(`/api/auth/${targetId}/follow`)
    return response.data
  }
)

export const userUpdateImage = createAsyncThunk(
  'USER_UPDATE_IMAGE',
  async (formData: FormData) => {
    const response = await Axios.patch(`/api/auth/image/update`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return response.data
  }
)

export const userDeleteImage = createAsyncThunk(
  'USER_DELETE_IMAGE',
  async () => {
    const response = await Axios.patch(`/api/auth/image/delete`)
    return response.data
  }
)

interface IUpdateProfileBody {
  nickname?: string
  description?: string
}

export const userUpdateProfile = createAsyncThunk(
  'USER_UPDATE_PROFILE',
  async (body: IUpdateProfileBody) => {
    const response = await Axios.patch(`/api/auth/profile`, body)
    return response.data
  }
)

export const userToggleRepostMusic = createAsyncThunk(
  'USER_MUSIC_REPOST',
  async (musicId: number) => {
    const response = await Axios.patch(`/api/auth/${musicId}/repost/music`)
    return response.data
  }
)
