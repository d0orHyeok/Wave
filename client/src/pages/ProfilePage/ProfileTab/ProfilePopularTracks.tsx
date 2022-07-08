import { getPopularMusicsOfUser } from '@api/musicApi'
import { PrimaryButton } from '@components/Common/Button'
import MusicCard from '@components/MusicCard/MusicCard'
import { IUser, IMusic } from '@appTypes/types.type.'
import React, { useCallback, useLayoutEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import * as CommonStyle from './common.style'

interface PopularTracksProps extends React.HTMLAttributes<HTMLDivElement> {
  user: IUser
  editable?: boolean
}

const ProfilePopularTracks = ({
  user,
  editable,
  ...props
}: PopularTracksProps) => {
  // 재생회수가 100회 이상인 음악중 재생횟수가 가장높은 10개 음악을 가져온다
  const [musics, setMusics] = useState<IMusic[]>([])

  const getPopularMusics = useCallback(async () => {
    if (!user?.id) {
      return
    }

    try {
      const response = await getPopularMusicsOfUser(user.id)
      setMusics(response.data)
    } catch (error: any) {
      console.error(error.response || error)
    }
  }, [user?.id])

  useLayoutEffect(() => {
    getPopularMusics()
  }, [getPopularMusics])

  return (
    <>
      {musics.length ? (
        <div {...props}>
          {musics.map((music, index) => (
            <MusicCard
              key={index}
              music={music}
              buttonProps={{ mediaSize: 1200 }}
            />
          ))}
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
            <div className="empty-content">{`There's no tracks or playlists`}</div>
          )}
        </CommonStyle.Empty>
      )}
    </>
  )
}

export default ProfilePopularTracks
