import { IPlaylist } from './../player/palyerSlice.interface'
import { RootState } from '@redux/store'
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import Axios, { interceptWithAccessToken } from '@api/Axios'
import axios from 'axios'
import {
  IUserLoginBody,
  IUserRegisterBody,
  IUserState,
  IUserUpdatePlaylistMusicsParams,
} from './userSlice.interface'

const initialState: IUserState = {
  isLogin: false,
  userData: undefined,
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

export const userUpdateProfile = createAsyncThunk(
  'USER_UPDATE_PROFILE',
  async (data: { nickname?: string; description?: string }) => {
    const response = await Axios.patch(`/api/auth/profile`, data)
    return response.data
  }
)

export const userAddMusicsToPlaylist = createAsyncThunk(
  'USER_PLAYLIST_ADD_MUSIC',
  async ({ playlistId, musicIds }: IUserUpdatePlaylistMusicsParams) => {
    const response = await Axios.patch(
      `/api/playlist/musics/add/${playlistId}`,
      {
        musicIds,
      }
    )
    return response.data
  }
)

export const userDeleteMusicsFromPlaylist = createAsyncThunk(
  'USER_PLAYLIST_DELETE_MUSIC',
  async ({ playlistId, musicIds }: IUserUpdatePlaylistMusicsParams) => {
    const response = await Axios.patch(
      `/api/playlist/musics/delete/${playlistId}`,
      { musicIds }
    )
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
      state.userData = undefined
    },
    [userAuth.fulfilled.type]: (state, action) => {
      state.isLogin = true
      state.userData = action.payload
    },
    [userAuth.rejected.type]: (state) => {
      state.isLogin = false
      state.userData = undefined
    },
    [userLogout.pending.type]: (state) => {
      // 재발급 전에 기존의 accessToken을 폐기
      state.isLogin = false
      state.userData = undefined
    },
    [userLogout.fulfilled.type]: (state) => {
      state.isLogin = false
      state.userData = undefined
    },
    [userLogout.rejected.type]: (state) => {
      state.isLogin = false
      state.userData = undefined
    },
    [userToggleLikeMusic.fulfilled.type]: (state, action) => {
      if (state.userData) {
        state.userData.likeMusics = action.payload.likeMusics
      }
    },
    [userToggleFollow.fulfilled.type]: (state, action) => {
      if (state.userData) {
        state.userData.following = action.payload.following
      }
    },
    [userUpdateImage.fulfilled.type]: (state, action) => {
      if (state.userData) {
        state.userData.profileImage = action.payload
      }
    },
    [userDeleteImage.fulfilled.type]: (state) => {
      if (state.userData) {
        state.userData.profileImage = undefined
      }
    },
    [userUpdateProfile.fulfilled.type]: (state, action) => {
      if (state.userData) {
        const { nickname, description } = action.payload
        state.userData.nickname = nickname
        state.userData.description = description
      }
    },
    [userAddMusicsToPlaylist.fulfilled.type]: (state, action) => {
      if (state.userData) {
        const updatePlaylist: IPlaylist = action.payload
        state.userData.playlists = state.userData.playlists.map((playlist) =>
          playlist.id === updatePlaylist.id ? updatePlaylist : playlist
        )
      }
    },
    [userDeleteMusicsFromPlaylist.fulfilled.type]: (state, action) => {
      if (state.userData) {
        const updatePlaylist: IPlaylist = action.payload
        state.userData.playlists = state.userData.playlists.map((playlist) =>
          playlist.id === updatePlaylist.id ? updatePlaylist : playlist
        )
      }
    },
    [userToggleRepostMusic.fulfilled.type]: (state, action) => {
      if (state.userData) {
        state.userData.repostMusics = action.payload.reposts
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
