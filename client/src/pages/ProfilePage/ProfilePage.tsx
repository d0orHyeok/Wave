import { selectUser } from '@redux/features/user/userSlice'
import { IUserData } from '@redux/features/user/userSlice.interface'
import { useAppSelector } from '@redux/hook'
import React, { useCallback, useEffect, useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import * as S from './ProfilePage.style'
import CanNotFind from '../../components/CanNotFind/CanNotFind'
import Loading from '@components/Loading/Loading'
import ProfileHead from './ProfileHead/ProfileHead'
import ProfileNav from './ProfileNav/ProfileNav'
import { getUserById } from '@api/userApi'
import { Helmet } from 'react-helmet'
import ProfileAll from './ProfileTab/ProfileAll'
import ProfilePopularTracks from './ProfileTab/ProfilePopularTracks'
import ProfileTracks from './ProfileTab/ProfileTracks'
import ProfilePlaylists from './ProfileTab/ProfilePlaylists'
import ProfileReposts from './ProfileTab/ProfileReposts'

const ProfilePage = () => {
  const { userId, nav } = useParams()
  const location = useLocation()
  const navigate = useNavigate()

  const user = useAppSelector(selectUser)
  const [isLoading, setIsLoading] = useState(true)
  const [editable, setEditable] = useState(false)
  const [profileData, setProfileData] = useState<IUserData>()

  const getProfileData = useCallback(async () => {
    if (!userId) {
      setIsLoading(false)
      setProfileData(undefined)
      return
    }

    setIsLoading(true)
    if (userId === user.userData?.id) {
      setEditable(true)
      setProfileData(user.userData)
    } else {
      try {
        const response = await getUserById(userId)
        setProfileData(response.data)
      } catch (error: any) {
        console.error(error.response || error)
        setProfileData(undefined)
      }
      setEditable(false)
    }
    setIsLoading(false)
  }, [user.userData, userId])

  useEffect(() => {
    if (!userId) {
      setIsLoading(false)
      return
    }

    if (location.pathname === '/profile') {
      navigate('/profile/you')
    } else if (userId === 'you') {
      !user.userData?.id
        ? navigate('/')
        : navigate(`/profile/${user.userData.id}`)
    } else {
      getProfileData()
    }
  }, [location.pathname, navigate, userId, getProfileData, user.userData?.id])

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
