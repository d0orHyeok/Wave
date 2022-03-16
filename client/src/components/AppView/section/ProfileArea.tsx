import React from 'react'
import * as S from './ProfileArea.style'
import { FaUserAlt } from 'react-icons/fa'
import { useAppSelector } from '@redux/hook'
import { selectUser } from '@redux/features/user/userSlice'

interface ProfileAreaProps {
  className?: string
  fold: boolean
}

const ProfileArea = ({ className, fold }: ProfileAreaProps) => {
  const user = useAppSelector(selectUser)

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
      <S.ProfileWrapper fold={fold} className={className && className} onClick={handleClick}>
        <S.ImageArea>
          {user.userData && user.userData.image ? (
            <img className="user-image" src={user.userData.image} alt="profile" />
          ) : (
            <FaUserAlt className="empty-image" />
          )}
        </S.ImageArea>
        <span className="profile-username">username</span>
      </S.ProfileWrapper>
      <S.MyMenu
        fold={fold}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{
          vertical: fold ? 'top' : 'bottom',
          horizontal: fold ? 'right' : 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: fold ? 'left' : 'right',
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
