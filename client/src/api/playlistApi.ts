import Axios from '@api/Axios'

export const getPlaylistByPermalink = (userId: string, permalink: string) => {
  return Axios.get(`/api/playlist/${userId}/${permalink}`)
}

export const findPlaylistsContainsMusic = (
  musicId: number,
  take = 15,
  skip = 0
) => {
  return Axios.get(
    `api/playlist/playlists/detail/${musicId}?skip=${skip}&take=${take}`
  )
}
