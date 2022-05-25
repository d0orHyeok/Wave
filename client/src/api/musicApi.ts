import Axios from './Axios'

export const getAllMusic = () => {
  return Axios.get('/api/music/')
}

export const getMusicByPermalink = (permalink: string) => {
  return Axios.get(`/api/music/${permalink}`)
}

export const uploadMusic = (formData: FormData) => {
  return Axios.post('/api/music/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
}

export const countMusic = (musicId: number) => {
  return Axios.patch(`/api/music/${musicId}/count`)
}
