import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '@redux/hook'
import {
  selectUser,
  silentRefresh,
  userAuth,
} from '@redux/features/user/userSlice'
import { IUserState } from '@redux/features/user/userSlice.interface'

export interface IWithUserProps {
  user: IUserState
}

const withUser = <P extends IWithUserProps>(
  SpecificComponent: React.ComponentType<P>,
  option: boolean | null
) => {
  function AuthenticationCheck(props: P) {
    const user = useAppSelector(selectUser)
    const dispatch = useAppDispatch()
    const navigate = useNavigate()

    useEffect(() => {
      if (user.isLogin && user.userData) {
        if (option === false) {
          navigate('/')
        }
      } else {
        dispatch(userAuth())
          // 유저인증
          .unwrap()
          .then(() => {
            if (option === false) {
              navigate('/')
            }
          })
          .catch(() => {
            dispatch(silentRefresh()).then((response) => {
              if (response.payload) {
                if (option === false) {
                  navigate('/')
                }
              } else {
                if (option) {
                  navigate('/')
                }
              }
            })
          })
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return <SpecificComponent {...props} user={user} />
  }
  return React.createElement(AuthenticationCheck)
}

export default withUser
