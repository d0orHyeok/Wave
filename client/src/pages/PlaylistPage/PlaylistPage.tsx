import { getPlaylistByPermalink } from '@api/playlistApi'
import Loading from '@components/Loading/Loading'
import { IPlaylist } from '@redux/features/player/palyerSlice.interface'
import React, { useCallback, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import styled from 'styled-components'
import PlaylistHead from './PlaylistHead/PlaylistHead'

const Wrapper = styled.div`
  min-height: 100%;
  max-width: 1200px;
  width: 100%;
  margin: 0 auto;
  font-size: 14px;
  line-height: 14px;
`

const PlaylistPage = () => {
  const { userId, permalink } = useParams()
  const navigate = useNavigate()

  const [playlist, setPlaylist] = useState<IPlaylist | null>(null)

  const getPlaylistDataFromServer = useCallback(() => {
    if (!userId || !permalink) {
      navigate('/playlist/notfound')
      return
    }

    getPlaylistByPermalink(userId, permalink)
      .then((res) => setPlaylist(res.data))
      .catch((error) => {
        console.error(error.response || error)
        navigate('playlist/notfound')
      })
  }, [navigate, permalink, userId])

  useEffect(() => {
    getPlaylistDataFromServer()
  }, [getPlaylistDataFromServer])

  console.log(playlist)

  return !playlist ? (
    <Loading />
  ) : (
    <Wrapper>
      <PlaylistHead playlist={playlist} />
      <div>PlaylistPage</div>
    </Wrapper>
  )
}

export default PlaylistPage
