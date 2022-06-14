import { IMusic } from '@redux/features/player/palyerSlice.interface'
import React, { useCallback, useEffect, useState } from 'react'
import { useInView } from 'react-intersection-observer'
import { getUserMusics } from '@api/musicApi'
import * as CommonStyle from './common.style'
import { Link } from 'react-router-dom'
import { PrimaryButton } from '@components/Common/Button'
import MusicCard from '@components/MusicCard/MusicCard'
import LoadingArea from '@components/Loading/LoadingArea'

interface ProfileTracksProps extends React.HTMLAttributes<HTMLDivElement> {
  userId: string
  editable?: boolean
}

const ProfileTracks = ({ userId, editable, ...props }: ProfileTracksProps) => {
  const { ref, inView } = useInView()

  const [musics, setMusics] = useState<IMusic[]>([])
  const [page, setPage] = useState(0)
  const [done, setDone] = useState(false)
  const [loading, setLoading] = useState(false)

  const getRelatedMusics = useCallback(async () => {
    const getNum = 15

    if (done) {
      return
    }

    setLoading(true)
    try {
      const skip = page * getNum
      const response = await getUserMusics(userId, skip, skip + getNum)
      const getItems: IMusic[] = response.data
      if (!getItems || getItems.length < getNum) {
        setDone(true)
      }
      setMusics((prevState) => [...prevState, ...getItems])
    } catch (error: any) {
      console.error(error.response || error)
      setDone(true)
    }
    setLoading(false)
  }, [userId, done, page])

  useEffect(() => {
    getRelatedMusics()
  }, [getRelatedMusics])

  useEffect(() => {
    if (inView && !loading && !done) {
      setPage((prevState) => prevState + 1)
    }
  }, [inView, loading, done])

  return (
    <>
      {musics.length ? (
        <div {...props}>
          {musics.map((music, index) => (
            <MusicCard key={index} music={music} />
          ))}
          <LoadingArea ref={ref} loading={loading} />
        </div>
      ) : (
        <CommonStyle.Empty>
          <CommonStyle.StyledEmptyTrackIcon />
          {editable ? (
            <>
              <div className="empty-content">
                Seems a little quiet over here
              </div>
              <div className="empty-link">
                <Link to={`/upload`}>
                  Upload a track to share it with your followers.
                </Link>
              </div>
              <PrimaryButton className="empty-button">
                <Link to={`/upload`}>Upload Now</Link>
              </PrimaryButton>
            </>
          ) : (
            <div className="empty-content">{`There's no tracks`}</div>
          )}
        </CommonStyle.Empty>
      )}
    </>
  )
}

export default ProfileTracks
