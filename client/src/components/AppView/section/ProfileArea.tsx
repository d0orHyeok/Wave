import React, { useRef } from 'react'
import * as S from './ProfileArea.style'
import { FaUserAlt } from 'react-icons/fa'
import { useAppSelector } from '@redux/hook'
import { selectUser } from '@redux/features/user/userSlice'

const ProfileArea = () => {
  const user = useAppSelector(selectUser)

  const profileRef = useRef<HTMLDivElement>(null)

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }

  return (
    <>
      <S.ProfileWrapper onClick={handleClick} ref={profileRef}>
        <S.ImageArea>
          {user.userData && user.userData.image ? (
            <img className="user-image" src={user.userData.image} alt="profile" />
          ) : (
            <FaUserAlt className="empty-image" />
          )}
        </S.ImageArea>
        <span>username</span>
      </S.ProfileWrapper>
      <S.MyMenu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <S.MyMenuItem onClick={handleClose}>보관함</S.MyMenuItem>
        <S.MyMenuItem onClick={handleClose}>계정설정</S.MyMenuItem>
        <S.MyMenuItem onClick={handleClose}>로그아웃</S.MyMenuItem>
      </S.MyMenu>
    </>
  )
}

export default React.memo(ProfileArea)
