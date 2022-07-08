import Axios from '@api/Axios'

interface CreateCommentBody {
  text: string
  musicId: number
  commentedAt?: number
}

export const getCommentsByUserId = (userId: string) => {
  return Axios.get(`/api/comment/user/${userId}`)
}

export const createComment = (createCommentBody: CreateCommentBody) => {
  const parseIntValue = Math.floor(createCommentBody.commentedAt || 0)
  return Axios.post('/api/comment/create', {
    ...createCommentBody,
    commentedAt: parseIntValue,
  })
}

export const deleteComment = (commentId: number) => {
  return Axios.delete(`/api/comment/${commentId}`)
}
