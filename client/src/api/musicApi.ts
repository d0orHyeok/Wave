import Axios from './Axios'

export const getAllMusic = () => {
  return Axios.get('/api/music/')
}

export const getMusicByPermalink = (userId: string, permalink: string) => {
  return Axios.get(`/api/music/permalink/${userId}/${permalink}`)
}

export const findRelatedMusics = (musicId: number, skip = 0, take = 10) => {
  return Axios.get(`/api/music/related/${musicId}?skip=${skip}&take=${take}`)
}

export const getMusicsByIds = (musicIds: number[]) => {
  return Axios.get(`/api/music/ids?ids=${musicIds.join(',')}`)
}

export const getUserMusics = (userId: string, skip = 0, take = 10) => {
  return Axios.get(`/api/music/user/${userId}?skip=${skip}&take=${take}`)
}

export const getPopularMusicsOfUser = (userId: string) => {
  return Axios.get(`/api/music/popular/${userId}`)
}

export const uploadMusic = (formData: FormData) => {
  return Axios.post('/api/music/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
}

export const countMusic = (musicId: number) => {
  return Axios.patch(`/api/music/${musicId}/count`)
}
