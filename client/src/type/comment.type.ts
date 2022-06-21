import { IMusic } from './music.type'
import { IUser } from './user.type'

export interface IComment {
  id: number

  // Comment Data
  text: string
  commentedAt: number

  // Create User
  userId: string
  user: IUser

  // Commented Music
  musicId: number
  music: IMusic

  // Date
  createdAt: string | Date
  updatedAt: string | Date
}
