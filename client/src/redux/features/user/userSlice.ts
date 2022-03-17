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
  try {
    const response = await Axios.get('/api/auth/info')
    return response.data
  } catch (error) {
    return 'Auth Error'
  }
})

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    // toggleLogin: (state) => {
    //   state.isLogin = !state.isLogin
    // },
    // setLogin: (state, action: PayloadAction<boolean>) => {
    //   state.isLogin = action.payload
    // },
  },
  extraReducers: {
    [userLogin.fulfilled.type]: (state, action) => {
      state.accessToken = action.payload
      Axios.defaults.headers.common[
        'Authorization'
      ] = `Bearer ${action.payload}`
    },
    [userLogin.rejected.type]: (state) => {
      state.isLogin = false
      state.accessToken = null
      state.userData = null
    },
    [userAuth.fulfilled.type]: (state, action) => {
      state.isLogin = true
      state.userData = action.payload
    },
    [userAuth.rejected.type]: (state) => {
      state.isLogin = false
      state.accessToken = null
      state.userData = null
    },
  },
})

// Action creators are generated for each case reducer function
export const {} = userSlice.actions

// Other code such as selectors can use the imported `RootState` type
export const selectUser = (state: RootState) => state.user
export const selectUserData = (state: RootState) => state.user.userData

export default userSlice.reducer
