import { RootState } from '@redux/store'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface IUserData {
  username: string
  email: string
  nickname?: string
  image?: string
}

export interface IUserState {
  isLogin: boolean
  userData?: IUserData | null
}

const initialState: IUserState = {
  isLogin: false,
  userData: null,
}

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
})

// Action creators are generated for each case reducer function
export const { toggleLogin, setLogin } = userSlice.actions

// Other code such as selectors can use the imported `RootState` type
export const selectUser = (state: RootState) => state.user
export const selectUserData = (state: RootState) => state.user.userData

export default userSlice.reducer
