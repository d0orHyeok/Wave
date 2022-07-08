import {
  EmptyProfileImage,
  EmptyProfileImageBackground,
} from '@styles/EmptyImage'
import { IUser } from '@appTypes/types.type.'
import React, { useCallback, useLayoutEffect, useState } from 'react'
import styled from 'styled-components'
import { getGradientFromImageUrl } from '@api/functions'
import * as AnyHeadStyle from '@styles/AnyHead.style'

interface IProfileHeadProps {
  user: IUser
}

const Container = styled(AnyHeadStyle.AnyHeadWrapper)<{ background: string }>`
  display: flex;
  align-items: flex-start;
`

const Profile = styled(AnyHeadStyle.AnyHeadImage)`
  flex-shrink: 0;
  border-radius: 100px;
  margin-right: 30px;

  ${({ theme }) => theme.device.tablet} {
    border-radius: 75px;
  }
`

const UserInfo = styled(AnyHeadStyle.AnyHeadInfo)``

const ProfileHead = ({ user }: IProfileHeadProps) => {
  const [background, setBackground] = useState(EmptyProfileImageBackground)

  const changeBackground = useCallback(async () => {
    // 유저의 프로필 이미지에 따라 배경을 변화시킨다
    if (user.profileImage) {
      const url = `${user.profileImage}`
      const newGradient = await getGradientFromImageUrl(
        url,
        EmptyProfileImageBackground
      )
      setBackground(newGradient)
    } else {
      setBackground(EmptyProfileImageBackground)
    }
  }, [user.profileImage])

  useLayoutEffect(() => {
    changeBackground()
  }, [changeBackground])

  return (
    <Container background={background}>
      <Profile>
        {!user.profileImage ? (
          <EmptyProfileImage className="img" />
        ) : (
          <img className="img" src={user.profileImage} alt="" />
        )}
      </Profile>

      <UserInfo>
        <h1 className="info info-main">{user.nickname || user.username}</h1>
        <h2 className="info">{user.username}</h2>
      </UserInfo>
      <div></div>
    </Container>
  )
}

export default ProfileHead
