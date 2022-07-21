import React, { useCallback, useEffect, useState } from 'react'
import { searchPlaylist } from '@api/playlistApi'
import NoSearchResult from './NoSearchResult'
import LoadingArea from '@components/Loading/LoadingArea'
import { IPlaylist } from '@appTypes/playlist.type'
import PlaylistCard from '@components/PlaylistCard/PlaylistCard'

interface ISearchPlaylistsProps {
  keyward: string
}

const SearchPlaylist = ({ keyward }: ISearchPlaylistsProps) => {
  const [playlists, setPlaylists] = useState<IPlaylist[]>([])
  const [page, setPage] = useState(0)
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)

  const handleOnView = useCallback(
    (inView: boolean) => {
      if (inView && !loading && !done) {
        setPage((prevState) => prevState + 1)
      }
    },
    [loading, done]
  )

  const getPlaylistsByKeyward = useCallback(async () => {
    if (!keyward || done) {
      return
    }

    setLoading(true)
    try {
      const getNum = 15
      const skip = page * getNum
      const response = await searchPlaylist(keyward, skip, skip + getNum)
      const getItems = response.data
      if (!getItems || getItems.length < getNum) {
        setDone(true)
      }
      setPlaylists((state) => [...state, ...getItems])
    } catch (error) {
      console.error(error)
      setDone(true)
    } finally {
      setLoading(false)
    }
  }, [done, keyward, page])

  useEffect(() => {
    getPlaylistsByKeyward()
  }, [getPlaylistsByKeyward])

  return playlists.length || !done ? (
    <div>
      {playlists.map((playlist, index) => (
        <PlaylistCard key={index} playlist={playlist} />
      ))}
      <LoadingArea loading={loading} hide={done} onInView={handleOnView} />
    </div>
  ) : (
    <NoSearchResult keyward={keyward} />
  )
}

export default SearchPlaylist
