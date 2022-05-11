import React, { useCallback, useState } from 'react'
import * as S from './ProfileArea.style'
import { useAppDispatch, useAppSelector } from '@redux/hook'
import { MenuItem } from '@components/Common'
import { BiLogInCircle } from 'react-icons/bi'
import LoginModal from '@components/LoginModal/LoginModal'
import { selectUser, userLogout } from '@redux/features/user/userSlice'
import { useAlert } from '@redux/context/alertProvider'
import { useNavigate, Link } from 'react-router-dom'
import EmptyProfileImage from '@components/EmptyProfileImage/EmptyProfileImage'

interface ProfileAreaProps {
  className?: string
  fold: string
}

const ProfileArea = ({ className, fold }: ProfileAreaProps) => {
  const user = useAppSelector(selectUser)
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  const backendURI = process.env.REACT_APP_API_URL

  const openAlert = useAlert()
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = useCallback(() => {
    setAnchorEl(null)
  }, [])

  const handleClickAndNavigate = useCallback(
    (path: string) => (event: React.MouseEvent<HTMLElement>) => {
      event.preventDefault()
      navigate(path)
      handleClose()
    },
    [handleClose, navigate]
  )

  const handleClickLogout = useCallback(() => {
    dispatch(userLogout())
    openAlert('로그아웃 되었습니다.')
    handleClose()
    navigate('/home')
  }, [dispatch, handleClose, navigate, openAlert])

  return (
    <>
      <S.ProfileWrapper
        fold={fold}
        className={className && className}
        onClick={handleClick}
      >
        <S.ImageArea>
          {!user.isLogin ? (
            <BiLogInCircle className="empty-image" />
          ) : user.userData && user.userData.profileImage ? (
            <img
              className="user-image"
              src={`${backendURI}/${user.userData.profileImage}`}
              alt=""
            />
          ) : (
            <EmptyProfileImage size={30} />
          )}
        </S.ImageArea>
        <span className="profile-username">
          {!user.isLogin
            ? 'Sign In'
            : user.userData?.nickname || user.userData?.username || 'User'}
        </span>
      </S.ProfileWrapper>

      <S.MyMenu
        fold={fold}
        anchorEl={anchorEl}
        open={open && user.isLogin}
        onClose={handleClose}
        disableScrollLock={true}
        anchorOrigin={{
          vertical: fold ? 'top' : 'bottom',
          horizontal: fold ? 'right' : 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: fold ? 'left' : 'right',
        }}
      >
        <MenuItem onClick={handleClickAndNavigate(`/profile/you`)}>
          <Link to="/profile/you">프로필</Link>
        </MenuItem>
        <MenuItem onClick={handleClickAndNavigate('/settings')}>
          <Link to="/settings">설정</Link>
        </MenuItem>
        <MenuItem onClick={handleClickLogout}>로그아웃</MenuItem>
      </S.MyMenu>

      <LoginModal open={open && !user.isLogin} onClose={handleClose} />
    </>
  )
}

export default React.memo(ProfileArea)
