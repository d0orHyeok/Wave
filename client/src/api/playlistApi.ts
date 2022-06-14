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
