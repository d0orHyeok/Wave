import { findRelatedMusics } from '@api/musicApi'
import { IMusic } from '@redux/features/player/palyerSlice.interface'
import React, { useCallback, useEffect, useState } from 'react'
import styled from 'styled-components'
import { useInView } from 'react-intersection-observer'
import LoadingBar from '@components/Loading/LoadingBar'
import NoItem from './NoItem.style'
import MusicCard from '@components/MusicCard/MusicCard'

const LoadingArea = styled.div<{ hide?: boolean }>`
  display: ${({ hide }) => (hide ? 'none' : 'flex')};
  align-items: center;
  justify-content: center;
  margin: 30px 0;
`

const StyledMusicCard = styled(MusicCard)`
  margin: 10px 0;
`

interface TrackDetailRelatedTracksProps
  extends React.HTMLAttributes<HTMLDivElement> {
  musicId: number
}

const TrackDetailRelatedTracks = ({
  musicId,
  ...props
}: TrackDetailRelatedTracksProps) => {
  const { ref, inView } = useInView()

  const [musics, setMusics] = useState<IMusic[]>([])
  const [page, setPage] = useState(0)
  const [done, setDone] = useState(false)
  const [loading, setLoading] = useState(false)

  const getRelatedMusics = useCallback(async () => {
    if (done) {
      return
    }

    setLoading(true)
    try {
      const skip = page * 15
      const response = await findRelatedMusics(musicId, skip, skip + 15)
      const getItems: IMusic[] = response.data
      if (!getItems || getItems.length < 15) {
        setDone(true)
      }
      setMusics((prevState) => [...prevState, ...getItems])
    } catch (error: any) {
      console.error(error.response || error)
    }
    setLoading(false)
  }, [done, musicId, page])

  useEffect(() => {
    getRelatedMusics()
  }, [getRelatedMusics])

  useEffect(() => {
    if (inView && !loading && !done) {
      setPage((prevState) => prevState + 1)
    }
  }, [inView, loading, done])

  return musics.length ? (
    <>
      <div {...props}>
        {musics.map((music, index) => (
          <StyledMusicCard key={index} music={music} />
        ))}
        <LoadingArea ref={ref}>{loading ? <LoadingBar /> : <></>}</LoadingArea>
      </div>
    </>
  ) : (
    <NoItem>
      Sorry...
      <br />
      {`There's no related tracks`}
    </NoItem>
  )
}

export default TrackDetailRelatedTracks
