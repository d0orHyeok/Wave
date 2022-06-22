import { IUser } from '@appTypes/types.type.'
import { useAppSelector } from '@redux/hook'
import React, { useCallback, useEffect, useLayoutEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import * as S from './ProfilePage.style'
import CanNotFind from '../../components/CanNotFind/CanNotFind'
import Loading from '@components/Loading/Loading'
import ProfileHead from './ProfileHead/ProfileHead'
import ProfileNav from './ProfileNav/ProfileNav'
import { getUserById } from '@api/userApi'
import { Helmet } from 'react-helmet-async'
import ProfileAll from './ProfileTab/ProfileAll'
import ProfilePopularTracks from './ProfileTab/ProfilePopularTracks'
import ProfileTracks from './ProfileTab/ProfileTracks'
import ProfilePlaylists from './ProfileTab/ProfilePlaylists'
import ProfileReposts from './ProfileTab/ProfileReposts'

const ProfilePage = () => {
  const { userId, nav } = useParams()

  const myId = useAppSelector((state) => state.user.userData?.id)
  const [isLoading, setIsLoading] = useState(true)
  const [editable, setEditable] = useState(false)
  const [profileData, setProfileData] = useState<IUser>()

  const getProfileData = useCallback(async () => {
    setIsLoading(true)
    try {
      const response = await getUserById(
        userId === 'you' && myId ? myId : userId || 'fail'
      )
      setProfileData(response.data)
    } catch (error: any) {
      console.error(error.response || error)
      setProfileData(undefined)
    } finally {
      setIsLoading(false)
    }
  }, [userId, myId])

  useLayoutEffect(() => {
    getProfileData()
  }, [getProfileData])

  useEffect(() => {
    setEditable(myId === userId)
  }, [myId, userId])

  useEffect(() => {
    if (profileData) {
      setIsLoading(false)
    }
  }, [profileData])

  return (
    <>
      {isLoading ? (
        <Loading />
      ) : !profileData ? (
        <CanNotFind text="user" />
      ) : (
        <>
          <Helmet>
            <title>{`Profile ${
              profileData.nickname || profileData.username
            }  | Wave`}</title>
          </Helmet>
          <S.Wrapper>
            <ProfileHead data={profileData} />
            <S.Container>
              <ProfileNav className="profileNav" editable={editable} />
              {!nav ? (
                <ProfileAll user={profileData} editable={editable} />
              ) : nav === 'popular-tracks' ? (
                <ProfilePopularTracks user={profileData} editable={editable} />
              ) : nav === 'tracks' ? (
                <ProfileTracks userId={profileData.id} editable={editable} />
              ) : nav === 'playlists' ? (
                <ProfilePlaylists userId={profileData.id} />
              ) : nav === 'reposts' ? (
                <ProfileReposts user={profileData} />
              ) : (
                <></>
              )}
            </S.Container>
          </S.Wrapper>
        </>
      )}
    </>
  )
}

export default React.memo(ProfilePage)
