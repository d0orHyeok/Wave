import { numberFormat } from '@api/functions'
import { FollowTextButton } from '@components/Common/Button'
import { IUserData } from '@redux/features/user/userSlice.interface'
import { useAppSelector } from '@redux/hook'
import { EmptyProfileImage } from '@styles/EmptyImage'
import React from 'react'
import { IoMdPeople } from 'react-icons/io'
import { Link } from 'react-router-dom'
import styled from 'styled-components'

const StyledUl = styled.ul`
  display: flex;
  flex-wrap: wrap;
`

const StyledLi = styled.li`
  padding: 15px;
  & .detailUsers-item-imageBox {
    width: 150px;
    height: 150px;
    & .detailusers-item-link,
    & .detailUsers-item-img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      border-radius: 50%;
    }
  }

  & .detailUsers-item-info {
    text-align: center;
    margin-top: 10px;
    font-size: 14px;

    & .followers {
      color: ${({ theme }) => theme.colors.bgTextRGBA(0.6)};
      font-size: 12px;
      margin: 5px 0;
    }
  }

  & .followBtn {
    visibility: hidden;
  }

  &:hover {
    & .followBtn {
      visibility: visible;
    }
  }

  ${({ theme }) => theme.device.tablet} {
    & .detailUsers-item-imageBox {
      width: 120px;
      height: 120px;
    }
  }
`

const StyledFollowButton = styled(FollowTextButton)`
  border-radius: 4px;
`

const NoUser = styled.div`
  padding: 10vh 0;
  text-align: center;
  font-size: 20px;
  line-height: 30px;
  color: ${({ theme }) => theme.colors.bgTextRGBA(0.6)};
`

interface TrackDetailUsersPorps extends React.HTMLAttributes<HTMLUListElement> {
  users: IUserData[]
  isLikes?: boolean
  isReposts?: boolean
}

const TrackDetailUsers = ({
  users,
  isLikes,
  isReposts,
  ...props
}: TrackDetailUsersPorps) => {
  const userId = useAppSelector((state) => state.user.userData?.id)
  const following =
    useAppSelector((state) => state.user.userData?.following) || []

  return users?.length ? (
    <StyledUl {...props}>
      {users.map((user, index) => (
        <StyledLi key={index}>
          <div className="detailUsers-item-imageBox">
            <Link className="detailUsers-item-link" to={`/profile/${user.id}`}>
              {user.profileImage ? (
                <img
                  className="detailUsers-item-img"
                  src={user.profileImage}
                  alt=""
                />
              ) : (
                <EmptyProfileImage className="detailUsers-item-img" />
              )}
            </Link>
          </div>
          <div className="detailUsers-item-info">
            <div className="name">
              <Link to={`/profile/${user.id}`}>
                {user.nickname || user.username}
              </Link>
            </div>
            <div
              className="followers"
              title={`${numberFormat(user.followersCount)} followers`}
              style={{
                visibility: user.followersCount ? 'visible' : 'hidden',
              }}
            >
              <IoMdPeople className="icon-followers" />
              {` ${numberFormat(user.followersCount)} followers`}
            </div>
            {userId !== user.id ? (
              <StyledFollowButton
                className="followBtn"
                isFollow={following.findIndex((f) => f.id === user.id) !== -1}
              />
            ) : (
              <></>
            )}
          </div>
        </StyledLi>
      ))}
    </StyledUl>
  ) : (
    <NoUser>
      {`Thers's no ${isLikes ? 'like' : isReposts ? 'repost' : ''} user`}
    </NoUser>
  )
}

export default TrackDetailUsers
