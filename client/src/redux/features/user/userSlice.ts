import Axios from '@api/Axios'
import { RootState } from '@redux/store'
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios'
import {
  IUserLoginBody,
  IUserRegisterBody,
  IUserState,
} from './userSlice.interface'

const initialState: IUserState = {
  isLogin: false,
  userData: null,
  accessToken: null,
  // temp
  isLike: false,
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
      console.log(response)
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

export const silentRefresh = createAsyncThunk('SILENT_REFRESH', async () => {
  const response = await Axios.post('/api/auth/refresh')
  return response.data
})

export const userLogout = createAsyncThunk('LOGOUT', async () => {
  await Axios.post('/api/auth/signout')
})

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    toggleFollow: (state) => {
      state.isFollow = !state.isFollow
    },
    toggleLike: (state) => {
      state.isLike = !state.isLike
    },
  },
  extraReducers: {
    // 로그인
    [userLogin.fulfilled.type]: (state, action) => {
      state.accessToken = action.payload
    },
    [userLogin.rejected.type]: (state) => {
      state.isLogin = false
      state.accessToken = null
      state.userData = null
    },
    // 유저인증
    [userAuth.pending.type]: (state) => {
      // 인증전에 accessToken을 헤더 Authorization Bearer에 담아준다.
      Axios.defaults.headers.common[
        'Authorization'
      ] = `Bearer ${state.accessToken}`
    },
    [userAuth.fulfilled.type]: (state, action) => {
      const { userData } = action.payload

      state.isLogin = true
      state.userData = userData
    },
    [userAuth.rejected.type]: (state) => {
      state.isLogin = false
      state.accessToken = null
      state.userData = null
    },
    [silentRefresh.pending.type]: (state) => {
      // 재발급 전에 기존의 accessToken을 폐기
      state.accessToken = null
    },
    [silentRefresh.fulfilled.type]: (state, action) => {
      const { accessToken, userData } = action.payload

      state.isLogin = true
      state.accessToken = accessToken
      state.userData = userData
    },
    [silentRefresh.rejected.type]: (state) => {
      state.isLogin = false
      state.accessToken = null
      state.userData = null
    },
    [userLogout.pending.type]: (state) => {
      // 재발급 전에 기존의 accessToken을 폐기
      state.isLogin = false
      state.accessToken = null
      state.userData = null
    },
  },
})

// Action creators are generated for each case reducer function
export const { toggleFollow, toggleLike } = userSlice.actions

// Other code such as selectors can use the imported `RootState` type
export const selectUser = (state: RootState) => state.user
export const selectUserData = (state: RootState) => state.user.userData

export default userSlice.reducer
