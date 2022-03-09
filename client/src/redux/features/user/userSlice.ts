import { RootState } from '@redux/store'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface UserState {
  isLogin: boolean
}

const initialState: UserState = {
  isLogin: false,
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

export default userSlice.reducer
