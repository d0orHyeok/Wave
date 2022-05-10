import FastAverageColor from 'fast-average-color'
import EmptyProfileImage, {
  EmptyBackground,
} from '@components/EmptyProfileImage/EmptyProfileImage'
import { IUserData } from '@redux/features/user/userSlice.interface'
import React, { useCallback, useEffect, useState } from 'react'
import styled from 'styled-components'

interface IProfileHeadProps {
  data: IUserData
}

const Container = styled.div<{ background: string }>`
  padding: 2rem;
  display: flex;
  ${({ background }) => background}

  & > * {
    flex-shrink: 0;
  }
`

const Profile = styled.div`
  position: relative;
  width: 200px;
  height: 200px;
  & img {
    border-radius: 100px;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  margin-right: 2rem;

  ${({ theme }) => theme.device.tablet} {
    width: 150px;
    height: 150px;
  }
`

const UserInfo = styled.div`
  & .info {
    background-color: rgba(0, 0, 0, 0.75);
    padding: 0.25rem 0.5rem;
    &.info-nickname {
      font-size: 1.5rem;
      line-height: 1.5rem;
      color: rgba(255, 255, 255, 0.86);
      margin-bottom: 0.5rem;
    }
    &.info-username {
      font-size: 1rem;
      line-height: 1rem;
      color: rgba(255, 255, 255, 0.6);
    }
  }
`

const ProfileHead = ({ data }: IProfileHeadProps) => {
  const backendURI = process.env.REACT_APP_API_URL

  const [background, setBackground] = useState(EmptyBackground)

  const changeBackground = useCallback(async () => {
    // 유저의 프로필 이미지에 따라 배경을 변화시킨다
    if (data.profileImage) {
      const fac = new FastAverageColor()
      try {
        const url = `${backendURI}/${data.profileImage}`
        // 이미지의 평균주색
        const primary = await fac.getColorAsync(url)
        // 이미지의 평균보조색
        const secondary = await fac.getColorAsync(url, {
          algorithm: 'dominant',
        })
        const newbackground = `
                background: ${primary.rgb};
                background: linear-gradient(
                  135deg,
                  ${primary.rgba} 0%,
                  ${secondary.rgba} 100%
                );
            `
        setBackground(newbackground)
      } catch (error) {
        console.log(error)
        setBackground(EmptyBackground)
      }
    } else {
      setBackground(EmptyBackground)
    }
  }, [backendURI, data.profileImage])

  useEffect(() => {
    changeBackground()
  }, [changeBackground])

  return (
    <Container background={background}>
      <Profile>
        {!data.profileImage ? (
          <EmptyProfileImage />
        ) : (
          <img src={`${backendURI}/${data.profileImage}`} alt="" />
        )}
      </Profile>

      <UserInfo>
        <h1 className="info info-nickname">{data.nickname}</h1>
        <h2 className="info info-username">{data.username}</h2>
      </UserInfo>
      <div></div>
    </Container>
  )
}

export default ProfileHead
