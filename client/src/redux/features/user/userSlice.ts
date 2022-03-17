import Axios from '@api/Axios'
import { RootState } from '@redux/store'
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import axios from 'axios'
import { IUserRegisterBody, IUserState } from './userSlice.interface'

const initialState: IUserState = {
  isLogin: false,
  userData: null,
}

export const userRegister = createAsyncThunk(
  'SIGNUP',
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

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    toggleLogin: (state) => {
      state.isLogin = !state.isLogin
    },
    setLogin: (state, action: PayloadAction<boolean>) => {
      state.isLogin = action.payload
    },
  },
  extraReducers: {},
})

// Action creators are generated for each case reducer function
export const { toggleLogin, setLogin } = userSlice.actions

// Other code such as selectors can use the imported `RootState` type
export const selectUser = (state: RootState) => state.user
export const selectUserData = (state: RootState) => state.user.userData

export default userSlice.reducer
