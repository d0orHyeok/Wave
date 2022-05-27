import Axios from './Axios'

export const getAllMusic = () => {
  return Axios.get('/api/music/')
}

export const getMusicByPermalink = (permalink: string) => {
  return Axios.get(`/api/music/permalink/${permalink}`)
}

interface findRelatedMusicsPagingOption {
  take?: number
  skip?: number
}

export const findRelatedMusics = (
  musicId: number,
  pagingOption?: findRelatedMusicsPagingOption
) => {
  const body = pagingOption ? pagingOption : { skip: 0, take: 10 }
  return Axios.post(`/api/music/related/${musicId}`, body)
}

export const uploadMusic = (formData: FormData) => {
  return Axios.post('/api/music/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
}

export const countMusic = (musicId: number) => {
  return Axios.patch(`/api/music/${musicId}/count`)
}
