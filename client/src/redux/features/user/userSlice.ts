import { RootState } from '@redux/store'
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import Axios, { interceptWithAccessToken } from '@api/Axios'
import axios from 'axios'
import {
  IUserLoginBody,
  IUserRegisterBody,
  IUserState,
} from './userSlice.interface'

const initialState: IUserState = {
  isLogin: false,
  userData: null,
  // temp
  isFollow: false,
}

export const userRegister = createAsyncThunk(
  'REGISTER',
  async (registerInfo: IUserRegisterBody, { rejectWithValue }) => {
    try {
      const response = await Axios.post('/api/auth/signup', registerInfo)
      return response
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(error.response)
      } else {
        return rejectWithValue(error)
      }
    }
  }
)

export const userLogin = createAsyncThunk(
  'LOGIN',
  async (loginBody: IUserLoginBody, { rejectWithValue }) => {
    try {
      const response = await Axios.post('/api/auth/signin', loginBody)
      return response.data.accessToken
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(error.response?.data.message || '로그인 실패')
      } else {
        return rejectWithValue(error)
      }
    }
  }
)

export const userAuth = createAsyncThunk('AUTH', async () => {
  const response = await Axios.get('/api/auth/info')
  return response.data
})

export const userLogout = createAsyncThunk('LOGOUT', async () => {
  await Axios.post('/api/auth/signout')
})

export const userPushLikes = createAsyncThunk(
  'PUSH_LIKES',
  async (musicId: number, { rejectWithValue }) => {
    try {
      const response = await Axios.put('/api/auth/musics/like', { musicId })
      return response.data
    } catch (error) {
      return rejectWithValue('Like Fail')
    }
  }
)

export const userPullLikes = createAsyncThunk(
  'PULL_LIKES',
  async (musicId: number, { rejectWithValue }) => {
    try {
      const response = await Axios.put('/api/auth/musics/unlike', { musicId })
      return response.data
    } catch (error) {
      return rejectWithValue('Unlike Fail')
    }
  }
)

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    toggleFollow: (state) => {
      state.isFollow = !state.isFollow
    },
  },
  extraReducers: {
    // 로그인
    [userLogin.fulfilled.type]: (state, action) => {
      state.isLogin = true
      interceptWithAccessToken(action.payload)
    },
    [userLogin.rejected.type]: (state) => {
      state.isLogin = false
      state.userData = null
    },
    [userAuth.fulfilled.type]: (state, action) => {
      const { userData } = action.payload

      state.isLogin = true
      state.userData = userData
    },
    [userAuth.rejected.type]: (state) => {
      state.isLogin = false
      state.userData = null
    },
    [userLogout.pending.type]: (state) => {
      // 재발급 전에 기존의 accessToken을 폐기
      state.isLogin = false
      state.userData = null
    },
    [userPushLikes.fulfilled.type]: (state, action) => {
      const { userData } = action.payload
      state.userData = userData
    },
    [userPullLikes.fulfilled.type]: (state, action) => {
      const { userData } = action.payload
      state.userData = userData
    },
  },
})

// Action creators are generated for each case reducer function
export const { toggleFollow } = userSlice.actions

// Other code such as selectors can use the imported `RootState` type
export const selectUser = (state: RootState) => state.user
export const selectUserData = (state: RootState) => state.user.userData

export default userSlice.reducer
