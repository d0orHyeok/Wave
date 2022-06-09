import Axios from '@api/Axios'

export const getPlaylistByPermalink = (userId: string, permalink: string) => {
  return Axios.get(`/api/playlist/${userId}/${permalink}`)
}

export const findPlaylistsContainsMusic = (
  musicId: number,
  skip = 0,
  take = 15
) => {
  return Axios.get(
    `api/playlist/playlists/detail/${musicId}?skip=${skip}&take=${take}`
  )
}
