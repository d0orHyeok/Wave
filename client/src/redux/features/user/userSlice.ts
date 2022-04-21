import { RootState } from '@redux/store'
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import Axios, { interceptWithAccessToken } from '@api/Axios'
import axios from 'axios'
import {
  IToggleFollowParams,
  IToggleMusicLikeParams,
  IUserLoginBody,
  IUserRegisterBody,
  IUserState,
} from './userSlice.interface'

const initialState: IUserState = {
  isLogin: false,
  userData: null,
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

export const userToggleLikeMusic = createAsyncThunk(
  'TOGGLE_LIKES',
  async ({ musicId, isLike }: IToggleMusicLikeParams, { rejectWithValue }) => {
    const routePath = isLike ? 'like' : 'unlike'
    try {
      const response = await Axios.patch(`/api/auth/${musicId}/${routePath}`)
      return response.data
    } catch (error) {
      return rejectWithValue(`Failed to ${routePath} music`)
    }
  }
)

export const userToggleFollow = createAsyncThunk(
  'TOGGLE_FOLLOW',
  async (
    { followerId, isFollow }: IToggleFollowParams,
    { rejectWithValue }
  ) => {
    const routePath = isFollow ? 'follow' : 'unfollow'
    try {
      const response = await Axios.patch(`/api/auth/${followerId}/${routePath}`)
      return response.data
    } catch (error) {
      return rejectWithValue(`Failed to ${routePath}`)
    }
  }
)

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {},
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
    [userToggleLikeMusic.fulfilled.type]: (state, action) => {
      const { likes } = action.payload
      if (state.userData) {
        state.userData.likes = likes
      }
    },
    [userToggleFollow.fulfilled.type]: (state, action) => {
      const { followers, following } = action.payload
      if (state.userData) {
        state.userData.followers = followers
        state.userData.following = following
      }
    },
  },
})

// Action creators are generated for each case reducer function
export const {} = userSlice.actions

// Other code such as selectors can use the imported `RootState` type
export const selectUser = (state: RootState) => state.user
export const selectUserData = (state: RootState) => state.user.userData

export default userSlice.reducer
