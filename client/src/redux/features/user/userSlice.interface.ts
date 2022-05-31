import { ICommnet, IMusic, IPlaylist } from './../player/palyerSlice.interface'

type UserId = string

export interface IUserData {
  id: UserId
  username: string
  email: string
  nickname?: string
  profileImage?: string
  description?: string
  musics: IMusic[]
  musicsCount: number
  likeMusics: IMusic[]
  likeMusicsCount: number
  repostMusics: IMusic[]
  repostMusicsCount: number
  likePlaylists: IPlaylist[]
  likePlaylistsCount: number
  repostPlaylists: IPlaylist[]
  repostPlaylistsCount: number
  followers: IUserData[]
  following: IUserData[]
  followersCount: number
  followingCount: number
  playlists: IPlaylist[]
  playlistsCount: number
  commnets: ICommnet[]
  commentsCount: number
  createdAt: string
}

export interface IUserState {
  isLogin: boolean
  userData?: IUserData
}
