import Axios from '@api/Axios'
import { selectUser } from '@redux/features/user/userSlice'
import { IUserData } from '@redux/features/user/userSlice.interface'
import { useAppSelector } from '@redux/hook'
import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import * as S from './ProfilePage.style'
import CanNotFind from '../../components/CanNotFind/CanNotFind'
import Loading from '@components/Loading/Loading'
import ProfileArea from './ProfileArea/ProfileArea'

const ProfilePage = () => {
  const params = useParams()
  const location = useLocation()
  const navigate = useNavigate()

  const user = useAppSelector(selectUser)
  const [isLoading, setIsLoading] = useState(true)
  const [editable, setEditable] = useState(false)
  const [profileData, setProfileData] = useState<IUserData>()

  useEffect(() => {
    if (location.pathname === '/profile') {
      navigate('/profile/you')
    } else if (location.pathname === '/profile/you') {
      setEditable(true)
      setProfileData(user.userData)
    } else {
      const { userId } = params
      if (userId === user.userData?.id) {
        navigate('/profile/you')
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
            {editable && 'Edit!'}
            {profileData.nickname}
            <ProfileArea data={profileData} />
          </S.Container>
        </S.Wrapper>
      )}
    </>
  )
}

export default ProfilePage
