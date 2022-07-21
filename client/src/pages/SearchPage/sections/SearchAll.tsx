import React, { useCallback, useEffect, useState } from 'react'
import { searchUser } from '@api/userApi'
import NoSearchResult from './NoSearchResult'
import LoadingArea from '@components/Loading/LoadingArea'
import { IUser } from '@appTypes/user.type'
import UserCard from '@components/UserCard/UserCard'
import { IMusic } from '@appTypes/music.type'
import { IPlaylist } from '@appTypes/playlist.type'
import { searchMusic } from '@api/musicApi'
import { searchPlaylist } from '@api/playlistApi'
import MusicCard from '@components/MusicCard/MusicCard'
import PlaylistCard from '@components/PlaylistCard/PlaylistCard'

interface ISearchAllProps {
  keyward: string
}

const SearchAll = ({ keyward }: ISearchAllProps) => {
  const [loading, setLoading] = useState(false)
  const [page, setPage] = useState(0)
  const [done, setDone] = useState({
    musics: false,
    playlists: false,
    users: false,
  })

  const [items, setItems] = useState<(IUser | IMusic | IPlaylist)[]>([])

  const handleOnView = useCallback(
    (inView: boolean) => {
      if (inView && !loading && !done) {
        setPage((prevState) => prevState + 1)
      }
    },
    [loading, done]
  )

  const getMusics = useCallback(async () => {
    if (done.musics) return

    try {
      const getNum = 8
      const res = await searchMusic(
        keyward,
        page * getNum,
        page * getNum + getNum
      )

      if (!res.data || res.data.length < getNum) {
        setDone((state) => {
          return { ...state, musics: true }
        })
      }
      return res.data
    } catch (error) {
      console.error(error)
      setDone((state) => {
        return { ...state, musics: true }
      })
    }
  }, [done.musics, keyward, page])

  const getPlaylists = useCallback(async () => {
    if (done.playlists) return

    try {
      const getNum = 4
      const { data } = await searchPlaylist(
        keyward,
        page * getNum,
        page * getNum + getNum
      )

      if (!data || data.length < getNum) {
        setDone((state) => {
          return { ...state, playlists: true }
        })
      }
      return data
    } catch (error) {
      console.error(error)
      setDone((state) => {
        return { ...state, playlists: true }
      })
    }
  }, [done.playlists, keyward, page])

  const getUsers = useCallback(async () => {
    if (done.users) return

    try {
      const getNum = 8
      const { data } = await searchUser(
        keyward,
        page * getNum,
        page * getNum + getNum
      )

      if (!data || data.length < getNum) {
        setDone((state) => {
          return { ...state, users: true }
        })
      }
      return data
    } catch (error) {
      console.error(error)
      setDone((state) => {
        return { ...state, users: true }
      })
    }
  }, [done.users, keyward, page])

  const getItemsByKeyward = useCallback(async () => {
    if (!keyward || !Object.values(done).includes(false)) {
      return
    }

    setLoading(true)
    const musics = await getMusics()
    const playlists = await getPlaylists()
    const users = await getUsers()

    const getItems: (IMusic | IPlaylist | IUser)[] = []

    if (musics) {
      items.push(...musics)
    }
    if (playlists) {
      items.push(...playlists)
    }
    if (users) {
      items.push(...users)
    }

    const sortedArray = getItems.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
    setItems((state) => [...state, ...sortedArray])
    setLoading(false)
  }, [done, getMusics, getPlaylists, getUsers, items, keyward])

  useEffect(() => {
    getItemsByKeyward()
  }, [getItemsByKeyward])

  return items.length || Object.values(done).includes(false) ? (
    <div>
      {items.map((item, index) => {
        if ('profileImage' in item) {
          return <UserCard key={index} user={item} />
        }
        if ('title' in item) {
          return <MusicCard key={index} music={item} />
        }
        if ('name' in item) {
          return <PlaylistCard key={index} playlist={item} />
        }
      })}
      <LoadingArea
        loading={loading}
        hide={!Object.values(done).includes(false)}
        onInView={handleOnView}
      />
    </div>
  ) : (
    <NoSearchResult keyward={keyward} />
  )
}

export default SearchAll
