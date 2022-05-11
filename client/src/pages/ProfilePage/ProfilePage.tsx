import Axios from '@api/Axios'
import { selectUser } from '@redux/features/user/userSlice'
import { IUserData } from '@redux/features/user/userSlice.interface'
import { useAppSelector } from '@redux/hook'
import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import * as S from './ProfilePage.style'
import CanNotFind from '../../components/CanNotFind/CanNotFind'
import Loading from '@components/Loading/Loading'
import ProfileHead from './ProfileHead/ProfileHead'
import ProfileNav from './ProfileNav/ProfileNav'

const ProfilePage = () => {
  const params = useParams()
  const location = useLocation()
  const navigate = useNavigate()

  const user = useAppSelector(selectUser)
  const [isLoading, setIsLoading] = useState(true)
  const [editable, setEditable] = useState(false)
  const [profileData, setProfileData] = useState<IUserData>()

  useEffect(() => {
    const { userId } = params
    if (location.pathname === '/profile') {
      navigate('/profile/you')
    } else if (userId === 'you') {
      !user.userData ? navigate('/') : navigate(`/profile/${user.userData.id}`)
    } else {
      if (userId === user.userData?.id) {
        setEditable(true)
        setProfileData(user.userData)
      } else {
        setEditable(false)
        Axios.get(`/api/auth/${userId}`)
          .then((res) => setProfileData(res.data.userData))
          .catch((error) => console.log(error.response))
          .finally(() => setIsLoading(false))
      }
    }
  }, [location.pathname, navigate, params, user])

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
        <S.Wrapper>
          <S.Container>
            <ProfileHead data={profileData} />
            <ProfileNav editable={editable} />
          </S.Container>
        </S.Wrapper>
      )}
    </>
  )
}

export default ProfilePage
