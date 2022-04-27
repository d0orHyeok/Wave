import Axios from '@api/Axios'
import { selectUser } from '@redux/features/user/userSlice'
import { IUserData } from '@redux/features/user/userSlice.interface'
import { useAppSelector } from '@redux/hook'
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import * as S from './ProfilePage.style'

const ProfilePage = () => {
  const { permaId } = useParams()
  const user = useAppSelector(selectUser)
  const navigate = useNavigate()

  const [editable, setEditable] = useState(false)
  const [profileData, setProfileData] = useState<IUserData>()

  useEffect(() => {
    if (user.userData && permaId === user.userData.permaId) {
      setProfileData(user.userData)
      setEditable(true)
    } else {
      setEditable(false)
      Axios.get(`/api/auth/${permaId}`)
        .then((res) => {
          const { userData } = res.data
          if (userData) {
            setProfileData(userData)
          } else {
            navigate('/notfound')
          }
        })
        .catch(() => navigate('/notfound'))
    }
  }, [navigate, permaId, user])

  return (
    <S.Wrapper>
      <S.Container>
        {editable && 'Edit!'}
        {profileData?.nickname}
      </S.Container>
    </S.Wrapper>
  )
}

export default ProfilePage
