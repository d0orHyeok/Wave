import Axios from '@api/Axios'

export const getPlaylistByPermalink = (userId: string, permalink: string) => {
  return Axios.get(`/api/playlist/permalink/${userId}/${permalink}`)
}

export const findPlaylistsContainsMusic = (
  musicId: number,
  skip = 0,
  take = 15
) => {
  return Axios.get(
    `/api/playlist/playlists/detail/${musicId}?skip=${skip}&take=${take}`
  )
}

export const getPlaylistsByIds = (playlistIds: number[]) => {
  return Axios.get(`/api/playlist/ids?ids=${playlistIds.join(',')}`)
}

export const getUserPlaylists = (userId: string, skip = 0, take = 10) => {
  return Axios.get(`/api/playlist/user/${userId}?skip=${skip}&take=${take}`)
}

export const updatePlaylistData = (playlistId: number, body: any) => {
  return Axios.patch(`/api/playlist/update/${playlistId}`, body)
}

export const changePlaylistMusics = (
  playlistId: number,
  musicIds: number[]
) => {
  return Axios.patch(`/api/playlist/musics/change/${playlistId}`, { musicIds })
}

export const changePlaylistImage = (playlistId: number, image: File) => {
  const formData = new FormData()
  formData.append('file', image)

  return Axios.patch(`/api/playlist/image/${playlistId}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
}

export const deletePlaylist = (playlistId: number) => {
  return Axios.delete(`/api/playlist/${playlistId}`)
}
