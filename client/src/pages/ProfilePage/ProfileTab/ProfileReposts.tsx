import { sortByCreatedAt } from '@api/functions'
import { getMusicsByIds } from '@api/musicApi'
import { getPlaylistsByIds } from '@api/playlistApi'
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
import { BiRepost } from 'react-icons/bi'

const StyledRepostIcon = styled(BiRepost)`
  padding: 30px 80px;
  font-size: 100px;
  color: ${({ theme }) => theme.colors.bgTextRGBA(0.33)};
  border: 4px solid ${({ theme }) => theme.colors.bgTextRGBA(0.33)};
  border-radius: 8px;
`

const LoadingArea = styled.div<{ hide?: boolean }>`
  display: ${({ hide }) => (hide ? 'none' : 'flex')};
  align-items: center;
  justify-content: center;
  margin: 30px 0;
`

const StyledDiv = styled.div`
  & .profileReposts-item {
    &:not(:last-child) {
      margin-bottom: 10px;
    }
  }
`

interface ProfileRepostsProps extends React.HTMLAttributes<HTMLDivElement> {
  user: IUserData
}

const ProfileReposts = ({ user, ...props }: ProfileRepostsProps) => {
  const [items, setItems] = useState([
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
          {displayItems.map((item, index) =>
            'title' in item ? (
              <MusicCard
                className="profileReposts-item "
                key={index}
                music={item}
                repostUser={user}
              />
            ) : (
              <PlaylistCard
                className="profileReposts-item "
                key={index}
                playlist={item}
                repostUser={user}
              />
            )
          )}
          <LoadingArea ref={ref}>
            {loading ? <LoadingBar /> : <></>}
          </LoadingArea>
        </StyledDiv>
      ) : (
        <CommonStyle.Empty>
          <StyledRepostIcon />

          <div className="empty-content">
            {`You haven’t reposted any sounds.`}
          </div>
          <div className="empty-link">
            <Link to={`/home`}>{`Discover tracks & playlists`}</Link>
          </div>
        </CommonStyle.Empty>
      )}
    </>
  )
}

export default ProfileReposts
