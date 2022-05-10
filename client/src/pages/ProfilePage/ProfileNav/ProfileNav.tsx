import { useToggleFollow } from '@api/UserHooks'
import { FollowTextButton } from '@components/Common/Button'
import { useAppSelector } from '@redux/hook'
import React, { useCallback, useRef } from 'react'
import { Link, useParams } from 'react-router-dom'
import styled from 'styled-components'
import { navItems } from '../assets/profileNavItem'
import { BsFillCaretLeftFill, BsFillCaretRightFill } from 'react-icons/bs'

interface ProfileNavProps {
  editable?: boolean
}

const Nav = styled.div`
  font-size: 16px;
  margin-top: 8px;
  padding: 0 16px;
  display: flex;
  align-items: center;
  width: 100%;
  & ul {
    width: 400px;
    overflow-x: auto;
    display: flex;
    align-items: center;
    justify-content: space-between;
    white-space: nowrap;
    scroll-behavior: smooth;

    /* hide scroll bar */
    -ms-overflow-style: none; /* IE and Edge */
    scrollbar-width: none; /* Firefox */
    &::-webkit-scrollbar {
      display: none;
    }
    & li {
      position: relative;
      padding: 8px 0;
      margin-right: 16px;
      &:last-child {
        margin-right: 0;
      }
      &.selected {
        color: ${({ theme }) => theme.colors.primaryColor};
        &::before {
          display: block;
          background-color: ${({ theme }) => theme.colors.primaryColor};
        }
      }

      &::before {
        display: none;
        content: '';
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
        height: 2px;
        background-color: ${({ theme }) => theme.colors.bgText};
      }

      &:hover::before {
        display: block;
      }
    }
  }
`

const ScrollButton = styled.button`
  margin: 0 8px;
  margin-top: 4px;
  padding: 0;
  font-size: 16px;
  border: none;
  display: none;
  ${({ theme }) => theme.device.tablet} {
    display: block;
  }
`

const ButtonContainer = styled.div`
  margin-left: auto;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  & button {
    border-radius: 3px;
    height: 24px;
    padding: 0 8px;
    margin-right: 8px;
    &:last-child {
      margin-right: 0;
    }
  }

  & .profileBtn {
    &:hover {
      border-color: ${({ theme }) => theme.colors.bgTextRGBA(0.3)};
    }
  }
`

const ProfileNav = ({ editable }: ProfileNavProps) => {
  const { userId, '*': nav } = useParams()
  const toggleFollow = useToggleFollow()

  const following = useAppSelector((state) => state.user.userData?.following)

  const ulRef = useRef<HTMLUListElement>(null)

  const handleClickFollow = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      event.preventDefault()
      event.stopPropagation()
      if (userId) toggleFollow(userId)
    },
    [toggleFollow, userId]
  )

  const handleClickEdit = useCallback(() => {
    console.log('edit')
  }, [])

  const handleClickShare = useCallback(() => {
    console.log('share')
  }, [])

  const handleClickArrowButton =
    (move: -1 | 1) => (event: React.MouseEvent<HTMLButtonElement>) => {
      event.preventDefault()
      event.stopPropagation()
      if (ulRef.current) {
        const scrollLeft = ulRef.current.scrollLeft
        const moveLeft = ulRef.current.offsetWidth
        if (move > 0) {
          ulRef.current.scrollTo(scrollLeft + moveLeft, 0)
        } else {
          ulRef.current.scrollTo(scrollLeft - moveLeft, 0)
        }
      }
    }

  return (
    <Nav>
      <ScrollButton onClick={handleClickArrowButton(-1)}>
        <BsFillCaretLeftFill />
      </ScrollButton>
      <ul ref={ulRef}>
        {navItems.map((item, index) => (
          <li
            id={`profile-nav-${index}`}
            key={item.name}
            className={nav === item.path ? 'selected' : undefined}
          >
            <Link to={`/profile/${userId}${item.path ? '/' + item.path : ''}`}>
              {item.name}
            </Link>
          </li>
        ))}
      </ul>
      <ScrollButton onClick={handleClickArrowButton(1)}>
        <BsFillCaretRightFill />
      </ScrollButton>
      <ButtonContainer>
        {editable ? (
          <button className="profileBtn" onClick={handleClickEdit}>
            edit
          </button>
        ) : (
          <FollowTextButton
            isFollow={following?.findIndex((f) => f.id === userId) !== -1}
            onClick={handleClickFollow}
          />
        )}
        <button className="profileBtn" onClick={handleClickShare}>
          share
        </button>
      </ButtonContainer>
    </Nav>
  )
}

export default ProfileNav
