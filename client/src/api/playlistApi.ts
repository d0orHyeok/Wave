import Axios from '@api/Axios'

export const getPlaylistByPermalink = (userId: string, permalink: string) => {
  return Axios.get(`/api/playlist/${userId}/${permalink}`)
}
