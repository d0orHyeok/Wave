import { findPlaylistsContainsMusic } from '@api/playlistApi'
import PlaylistCard from '@components/PlaylistCard/PlaylistCard'
import { IPlaylist } from '@redux/features/player/palyerSlice.interface'
import React, { useCallback, useEffect, useState } from 'react'
import styled from 'styled-components'
import { useInView } from 'react-intersection-observer'
import LoadingBar from '@components/Loading/LoadingBar'

const NoPlaylsts = styled.div`
  padding: 10vh 0;
  text-align: center;
  font-size: 20px;
  line-height: 30px;
  color: ${({ theme }) => theme.colors.bgTextRGBA(0.6)};
`

const LoadingArea = styled.div<{ hide?: boolean }>`
  display: ${({ hide }) => (hide ? 'none' : 'flex')};
  align-items: center;
  justify-content: center;
  margin: 30px 0;
`

const StyledPlaylistCard = styled(PlaylistCard)`
  margin: 10px 0;
`

interface TrackDetailPlaylistsProps
  extends React.HTMLAttributes<HTMLDivElement> {
  musicId: number
}

const TrackDetailPlaylists = ({
  musicId,
  ...props
}: TrackDetailPlaylistsProps) => {
  const { ref, inView } = useInView()

  const [playlists, setPlaylists] = useState<IPlaylist[]>([])
  const [page, setPage] = useState(0)
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)

  const getInPlaylsitItems = useCallback(async () => {
    if (done) {
      return
    }

    setLoading(true)
    try {
      const skip = page * 15
      const response = await findPlaylistsContainsMusic(
        musicId,
        skip + 15,
        skip
      )
      const getItems: IPlaylist[] = response.data
      if (!getItems || getItems.length < 15) {
        setDone(true)
      }
      setPlaylists((prevState) => [...prevState, ...getItems])
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error(error.response || error)
    }
    setLoading(false)
  }, [done, musicId, page])

  useEffect(() => {
    getInPlaylsitItems()
  }, [getInPlaylsitItems])

  useEffect(() => {
    if (inView && !loading && !done) {
      setPage((prevState) => prevState + 1)
    }
  }, [inView, loading, done])

  return (
    <>
      <div {...props}>
        {playlists.length ? (
          <>
            {playlists.map((playlist, index) => (
              <StyledPlaylistCard key={index} playlist={playlist} />
            ))}

            <LoadingArea ref={ref}>
              {loading ? <LoadingBar /> : <></>}
            </LoadingArea>
          </>
        ) : (
          <NoPlaylsts>
            Sorry...
            <br />
            {`There's no playlist`}
          </NoPlaylsts>
        )}
      </div>
    </>
  )
}

export default TrackDetailPlaylists
