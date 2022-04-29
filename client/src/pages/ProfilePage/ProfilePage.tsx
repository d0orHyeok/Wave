import Axios from '@api/Axios'
import { selectUser } from '@redux/features/user/userSlice'
import { IUserData } from '@redux/features/user/userSlice.interface'
import { useAppSelector } from '@redux/hook'
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import * as S from './ProfilePage.style'
import CanNotFind from '../../components/CanNotFind/CanNotFind'

const ProfilePage = () => {
  const { userId } = useParams()
  const user = useAppSelector(selectUser)
  const navigate = useNavigate()

  const [editable, setEditable] = useState(false)
  const [profileData, setProfileData] = useState<IUserData>()

  useEffect(() => {
    if (user.userData && userId === user.userData.id) {
      setProfileData(user.userData)
      setEditable(true)
    } else {
      setEditable(false)
      Axios.get(`/api/auth/${userId}`)
        .then((res) => setProfileData(res.data.userData))
        .catch((error) => console.log(error.response))
    }
  }, [navigate, userId, user])

  return (
    <>
      {!profileData ? (
        <CanNotFind text="user" />
      ) : (
        <S.Wrapper>
          <S.Container>
            {editable && 'Edit!'}
            {profileData.nickname}
          </S.Container>
        </S.Wrapper>
      )}
    </>
  )
}

export default ProfilePage
