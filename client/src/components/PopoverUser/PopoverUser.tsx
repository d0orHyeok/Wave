import styled from 'styled-components'
import React, { useCallback, useEffect, useRef } from 'react'
import { IUserData } from '@redux/features/user/userSlice.interface'
import { Link } from 'react-router-dom'
import { EmptyProfileImage } from '@styles/EmptyImage'
import { IoMdPeople } from 'react-icons/io'
import { FollowTextButton } from '@components/Common/Button'
import { numberFormat } from '@api/functions'
import { useAppDispatch, useAppSelector } from '@redux/hook'
import { useLoginOpen } from '@redux/context/loginProvider'
import { userToggleFollow } from '@redux/thunks/userThunks'

const StyledDiv = styled.div<{ open?: boolean }>`
  &::before {
    border-top: 1px solid;
    border-left: 1px solid;
    border-color: inherit;
    content: '';
    transform: rotate(45deg);
    position: absolute;
    top: -7px;
    width: 12px;
    height: 12px;
    background-color: inherit;
  }

  &::after {
    content: '';
    position: absolute;
    top: -20px;
    width: 160px;
    height: 20px;
    opacity: 0;
  }

  position: absolute;
  top: 100%;
  left: 50%;
  transform: translate(-50%, 12px);
  z-index: 100;

  width: 160px;
  padding: 20px 0;
  border: 1px solid;
  border-color: ${({ theme }) => theme.colors.border1};
  border-radius: 4px;
  box-shadow: 0 2px 5px 0 ${({ theme }) => theme.colors.bgTextRGBA(0.16)};
  background-color: ${({ theme }) => theme.colors.bgColor};

  display: ${({ open }) => (open ? 'flex' : 'none')};
  flex-direction: column;
  align-items: center;

  & .popover-imageBox {
    width: 80px;
    height: 80px;
    border-radius: 40px;

    & .popover-imageBox-img {
      width: 100%;
      height: 100%;
      border-radius: inherit;
      object-fit: cover;
    }
  }

  & .popover-user-name {
    margin-top: 10px;
    color: ${({ theme }) => theme.colors.bgTextRGBA(0.86)};
  }

  & .popover-user-followers {
    display: flex;
    align-items: center;
    margin-top: 5px;
    font-size: 12px;

    & .popover-icon {
      font-size: 16px;
      margin-right: 3px;
    }

    &:hover {
      color: ${({ theme }) => theme.colors.bgTextRGBA(0.86)};
    }
  }
`

const StyledFollowBtn = styled(FollowTextButton)`
  border-radius: 4px;
  margin-top: 10px;
`

interface PopoverUserProps extends React.HTMLAttributes<HTMLDivElement> {
  user: IUserData
  open?: boolean
  anchorEl?: HTMLElement
}

const PopoverUser = ({ user, anchorEl, ...props }: PopoverUserProps) => {
  const dispatch = useAppDispatch()
  const openLogin = useLoginOpen()

  const userId = useAppSelector((state) => state.user.userData?.id)
  const following =
    useAppSelector((state) => state.user.userData?.following) || []

  const popoverRef = useRef<HTMLDivElement>(null)

  const handleClickFollow = useCallback(
    (targetId: string) => (event: React.MouseEvent<HTMLElement>) => {
      event.preventDefault()
      event.stopPropagation()
      if (!userId) {
        return openLogin()
      }

      dispatch(userToggleFollow(targetId))
    },
    [dispatch, openLogin, userId]
  )

  useEffect(() => {
    if (anchorEl && popoverRef.current) {
      anchorEl.appendChild(popoverRef.current)
    }
  }, [anchorEl])

  return (
    <StyledDiv ref={popoverRef} {...props}>
      <Link to={`/profile/${user.id}`}>
        <div className="popover-imageBox">
          {user.profileImage ? (
            <img
              className="popover-imageBox-img"
              src={user.profileImage}
              alt=""
            />
          ) : (
            <EmptyProfileImage className="popover-imageBox-img" />
          )}
        </div>
      </Link>
      <Link className="popover-user-name" to={`/profile/${user.id}`}>
        {user.nickname || user.username}
      </Link>
      {user.followersCount > 0 ? (
        <Link
          className="popover-user-followers"
          title={`${numberFormat(user.followersCount)} followers`}
          to={`/profile/${user.id}/followers`}
        >
          <IoMdPeople className="popover-icon" />
          {numberFormat(user.followersCount)}
        </Link>
      ) : (
        <></>
      )}
      {userId !== user.id ? (
        <StyledFollowBtn
          isFollow={following.findIndex((f) => f.id === user.id) !== -1}
          onClick={handleClickFollow(user.id)}
        />
      ) : (
        <></>
      )}
    </StyledDiv>
  )
}

export default PopoverUser
