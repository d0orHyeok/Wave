import { IPlaylist } from './../player/palyerSlice.interface'
import { RootState } from '@redux/store'
import { createSlice } from '@reduxjs/toolkit'
import { interceptWithAccessToken } from '@api/Axios'
import { IUserState } from './userSlice.interface'
import * as userThunks from '@redux/thunks/userThunks'
import * as playlistThunks from '@redux/thunks/playlistThunks'

const initialState: IUserState = {
  isLogin: false,
  userData: undefined,
}

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {},
  extraReducers: {
    // 로그인
    [userThunks.userLogin.fulfilled.type]: (state, action) => {
      state.isLogin = true
      interceptWithAccessToken(action.payload)
    },
    [userThunks.userLogin.rejected.type]: (state) => {
      state.isLogin = false
      state.userData = undefined
    },
    [userThunks.userAuth.fulfilled.type]: (state, action) => {
      state.isLogin = true
      state.userData = action.payload
    },
    [userThunks.userAuth.rejected.type]: (state) => {
      state.isLogin = false
      state.userData = undefined
    },
    [userThunks.userLogout.pending.type]: (state) => {
      // 재발급 전에 기존의 accessToken을 폐기
      state.isLogin = false
      state.userData = undefined
    },
    [userThunks.userLogout.fulfilled.type]: (state) => {
      state.isLogin = false
      state.userData = undefined
    },
    [userThunks.userLogout.rejected.type]: (state) => {
      state.isLogin = false
      state.userData = undefined
    },
    [userThunks.userToggleLikeMusic.fulfilled.type]: (state, action) => {
      if (state.userData) {
        state.userData.likeMusics = action.payload.likeMusics
      }
    },
    [userThunks.userToggleFollow.fulfilled.type]: (state, action) => {
      if (state.userData) {
        state.userData.following = action.payload.following
      }
    },
    [userThunks.userUpdateImage.fulfilled.type]: (state, action) => {
      if (state.userData) {
        state.userData.profileImage = action.payload
      }
    },
    [userThunks.userDeleteImage.fulfilled.type]: (state) => {
      if (state.userData) {
        state.userData.profileImage = undefined
      }
    },
    [userThunks.userUpdateProfile.fulfilled.type]: (state, action) => {
      if (state.userData) {
        const { nickname, description } = action.payload
        state.userData.nickname = nickname
        state.userData.description = description
      }
    },
    [userThunks.userToggleRepostMusic.fulfilled.type]: (state, action) => {
      if (state.userData) {
        state.userData.repostMusics = action.payload.reposts
      }
    },
    [playlistThunks.userAddMusicsToPlaylist.fulfilled.type]: (
      state,
      action
    ) => {
      if (state.userData) {
        const updatePlaylist: IPlaylist = action.payload
        state.userData.playlists = state.userData.playlists.map((playlist) =>
          playlist.id === updatePlaylist.id ? updatePlaylist : playlist
        )
      }
    },
    [playlistThunks.userDeleteMusicsFromPlaylist.fulfilled.type]: (
      state,
      action
    ) => {
      if (state.userData) {
        const updatePlaylist: IPlaylist = action.payload
        state.userData.playlists = state.userData.playlists.map((playlist) =>
          playlist.id === updatePlaylist.id ? updatePlaylist : playlist
        )
      }
    },
    [playlistThunks.userCreatePlaylist.fulfilled.type]: (state, action) => {
      if (state.userData) {
        const existPlaylists = state.userData.playlists || []
        state.userData.playlists = [...existPlaylists, action.payload]
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
