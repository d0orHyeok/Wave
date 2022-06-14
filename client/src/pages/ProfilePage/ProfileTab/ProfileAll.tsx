import { sortByCreatedAt } from '@api/functions'
import { getMusicsByIds } from '@api/musicApi'
import { getPlaylistsByIds } from '@api/playlistApi'
import { PrimaryButton } from '@components/Common/Button'
import LoadingBar from '@components/Loading/LoadingBar'
import MusicCard from '@components/MusicCard/MusicCard'
import PlaylistCard from '@components/PlaylistCard/PlaylistCard'
import { IMusic, IPlaylist } from '@redux/features/player/palyerSlice.interface'
import { IUserData } from '@redux/features/user/userSlice.interface'
import React, { useCallback, useEffect, useState } from 'react'
import { useInView } from 'react-intersection-observer'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import * as CommonStyle from './common.style'

const LoadingArea = styled.div<{ hide?: boolean }>`
  display: ${({ hide }) => (hide ? 'none' : 'flex')};
  align-items: center;
  justify-content: center;
  margin: 30px 0;
`

const StyledDiv = styled.div`
  & .profileAll-item {
    &:not(:last-child) {
      margin-bottom: 10px;
    }
  }
`

interface ProfileAllProps extends React.HTMLAttributes<HTMLDivElement> {
  user: IUserData
  editable?: boolean
}

const ProfileAll = ({ user, editable, ...props }: ProfileAllProps) => {
  const [items, setItems] = useState([
    ...user.musics,
    ...user.playlists,
    ...user.repostMusics,
    ...user.repostPlaylists,
  ])

  const { ref, inView } = useInView()

  const [displayItems, setDisplayItems] = useState<(IMusic | IPlaylist)[]>([])
  const [loading, setLoading] = useState(false)
  const [page, setPage] = useState(0)
  const [done, setDone] = useState(false)

  const getItems = useCallback(async () => {
    if (done) {
      return
    }

    const getNum = 15
    const skip = page * getNum
    const getItems = items.slice(skip, skip + getNum)
    if (!getItems || getItems.length < getNum) {
      setDone(true)
    }

    const playlistIds: number[] = []
    const musicIds: number[] = []
    getItems.forEach((item) =>
      'title' in item ? musicIds.push(item.id) : playlistIds.push(item.id)
    )

    try {
      const res1 = await getMusicsByIds(musicIds)
      const res2 = await getPlaylistsByIds(playlistIds)
      const array = sortByCreatedAt([...res1.data, ...res2.data])
      setDisplayItems((prevState) => [...prevState, ...array])
    } catch (error: any) {
      setItems([])
      console.error(error.response || error)
      setDone(true)
    }
    setLoading(false)
  }, [done, items, page])

  useEffect(() => {
    getItems()
  }, [getItems])

  useEffect(() => {
    if (inView && !loading && !done) {
      setPage((prevState) => prevState + 1)
    }
  }, [inView, loading, done])

  return (
    <>
      {displayItems.length ? (
        <StyledDiv {...props}>
          {displayItems.map((item, index) => {
            if ('title' in item) {
              const repostUser =
                user.repostMusics.findIndex((rm) => rm.id === item.id) !== -1
                  ? user
                  : undefined

              return (
                <MusicCard
                  className="profileAll-item "
                  key={index}
                  music={item}
                  repostUser={repostUser}
                />
              )
            } else {
              const repostUser =
                user.repostPlaylists.findIndex((rp) => rp.id === item.id) !== -1
                  ? user
                  : undefined

              return (
                <PlaylistCard
                  className="profileAll-item "
                  key={index}
                  playlist={item}
                  repostUser={repostUser}
                />
              )
            }
          })}
          <LoadingArea ref={ref}>
            {loading ? <LoadingBar /> : <></>}
          </LoadingArea>
        </StyledDiv>
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
            <div className="empty-content">{`There's no tracks or playlists`}</div>
          )}
        </CommonStyle.Empty>
      )}
    </>
  )
}

export default ProfileAll
