import { TypeStatus } from './common.type'
import { IMusic } from './music.type'
import { IUser } from './user.type'

export interface IPlaylist {
  id: number

  // Playlist Data
  name: string
  permalink: string
  status: TypeStatus

  // Optional Data
  image?: string
  description?: string
  tags?: string[]

  // Date
  createdAt: string | Date
  updatedAt: string | Date

  // Create User
  userId: string
  user: IUser

  // Musics In Playlist
  musics: IMusic[]
  musicsCount: number

  // Likes & Reposts
  likes: IUser[]
  reposts: IUser[]
  likesCount: number
  repostsCount: number
}
