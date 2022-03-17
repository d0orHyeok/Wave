import React from 'react'
import * as S from './ProfileArea.style'
import { FaUserAlt } from 'react-icons/fa'
import { useAppSelector } from '@redux/hook'
import { selectUser } from '@redux/features/user/userSlice'
import { MenuItem } from '@components/Common'
import { BiLogInCircle } from 'react-icons/bi'
import LoginModal from '@components/LoginModal/LoginModal'

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
        <>
          <S.ImageArea>
            {!user.isLogin ? (
              <BiLogInCircle className="empty-image" />
            ) : user.userData && user.userData.image ? (
              <img className="user-image" src={user.userData.image} alt="profile" />
            ) : (
              <FaUserAlt className="empty-image" />
            )}
          </S.ImageArea>
          <span className="profile-username">
            {!user.isLogin ? 'Sign In' : user.userData?.nickname || user.userData?.username || 'User'}
          </span>
        </>
      </S.ProfileWrapper>
      {user.isLogin ? (
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
          <MenuItem onClick={handleClose}>보관함</MenuItem>
          <MenuItem onClick={handleClose}>계정설정</MenuItem>
          <MenuItem onClick={handleClose}>로그아웃</MenuItem>
        </S.MyMenu>
      ) : (
        <LoginModal open={true} onClose={handleClose} />
      )}
    </>
  )
}

export default React.memo(ProfileArea)
