import { FollowTextButton } from '@components/Common/Button'
import { useAppDispatch, useAppSelector } from '@redux/hook'
import React, { useCallback, useRef, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import styled from 'styled-components'
import { navItems } from '../assets/profileNavItem'
import { BsFillCaretLeftFill, BsFillCaretRightFill } from 'react-icons/bs'
import { Modal } from '@components/Common'
import EditProfile from '@components/InnerModal/EditProfile'
import { useCopyLink } from '@api/Hooks'
import { useLoginOpen } from '@redux/context/loginProvider'
import { userToggleFollow } from '@redux/thunks/userThunks'

const Nav = styled.div`
  font-size: 16px;
  display: flex;
  align-items: center;
  border-bottom: 1px solid ${({ theme }) => theme.colors.bgColorRGBA(0.1)};
  & ul {
    overflow-x: auto;
    display: flex;
    align-items: center;
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
      padding: 10px 0;

      &:not(:last-child) {
        margin-right: 16px;
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

    ${({ theme }) => theme.device.tablet} {
      font-size: 14px;
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

interface ProfileNavProps extends React.HTMLAttributes<HTMLDivElement> {
  editable?: boolean
  editModalProps?: { onClose?: () => any }
}

const ProfileNav = ({
  editable,
  editModalProps,
  ...props
}: ProfileNavProps) => {
  const { userId, nav } = useParams()

  const dispatch = useAppDispatch()
  const copyLink = useCopyLink()
  const openLogin = useLoginOpen()

  const following = useAppSelector(
    (state) => state.user.userData?.following || []
  )
  const isLogin = useAppSelector((state) => state.user.isLogin)

  const ulRef = useRef<HTMLUListElement>(null)

  const [open, setOpen] = useState(false)

  const handleClickFollow = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      event.preventDefault()
      event.stopPropagation()
      if (isLogin) {
        if (userId) dispatch(userToggleFollow(userId))
      } else {
        openLogin()
      }
    },
    [isLogin, openLogin, dispatch, userId]
  )

  const handleCloseModal = useCallback(() => {
    setOpen(false)
    editModalProps?.onClose && editModalProps.onClose()
  }, [editModalProps])

  const handleClickArrowButton =
    (move: -1 | 1) => (event: React.MouseEvent<HTMLButtonElement>) => {
      event.preventDefault()
      event.stopPropagation()
      const target = ulRef.current
      if (target) {
        const scrollLeft = target.scrollLeft
        const length = target.children.length
        const widths = Array.from(target.children).map((c, index) =>
          index !== length - 1 ? c.clientWidth + 16 : c.clientWidth
        )
        let i = 0
        if (move > 0) {
          let moveLeft = 0
          while (moveLeft <= scrollLeft) {
            moveLeft += widths[i]
            i += 1
          }
          target.scrollTo(moveLeft, 0)
        } else {
          i = length - 1
          let moveLeft = target.scrollWidth
          while (moveLeft >= scrollLeft) {
            moveLeft -= widths[i]
            i -= 1
          }
          target.scrollTo(moveLeft, 0)
        }
      }
    }

  const handleClickNavItem =
    (index: number) => (event: React.MouseEvent<HTMLElement>) => {
      event.stopPropagation()
      const target = ulRef.current
      if (!target) {
        return
      }

      const length = target.children.length
      const widths = Array.from(target.children).map((c, index) =>
        index !== length - 1 ? c.clientWidth + 16 : c.clientWidth
      )

      const moveLeft = index
        ? widths.slice(0, index).reduce((a, b) => a + b)
        : 0
      target.scrollTo(moveLeft, 0)
    }

  const handleClickEdit = useCallback(() => {
    setOpen(true)
  }, [])

  const handleClickShare = useCallback(() => {
    copyLink(`${location.host}/profile/${userId}`, {
      success: 'Link Copied',
      fail: 'Fail to copy link',
    })
  }, [copyLink, userId])

  return (
    <>
      <Nav {...props}>
        <ScrollButton onClick={handleClickArrowButton(-1)}>
          <BsFillCaretLeftFill />
        </ScrollButton>
        <ul ref={ulRef}>
          {navItems.map((item, index) => (
            <li
              id={`profile-nav-${index}`}
              key={item.name}
              className={(nav || '') === item.path ? 'selected' : undefined}
            >
              <Link
                to={
                  index === 0
                    ? `/profile/${userId}`
                    : `/profile/${userId}/${item.path}`
                }
                onClick={handleClickNavItem(index)}
              >
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
            <>
              <button className="profileBtn" onClick={handleClickEdit}>
                edit
              </button>
              <Modal open={open} onClose={handleCloseModal}>
                <EditProfile onClose={handleCloseModal} />
              </Modal>
            </>
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
    </>
  )
}

export default ProfileNav
