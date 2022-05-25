import Axios from '@api/Axios'
import { createAsyncThunk } from '@reduxjs/toolkit'

interface IUserUpdatePlaylistMusicsParams {
  playlistId: number | string
  musicIds: number[]
}

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

interface ICreatePlaylistBody {
  name: string
  musicIds?: number[]
  status?: string
}

export const userCreatePlaylist = createAsyncThunk(
  'CREATE_PLAYLIST',
  async (body: ICreatePlaylistBody) => {
    const response = await Axios.post('/api/playlist/create', body)
    return response.data
  }
)
