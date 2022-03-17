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
  option: boolean | null,
  adminRoute = false
) => {
  function AuthenticationCheck(props: P) {
    const user = useAppSelector(selectUser)
    const dispatch = useAppDispatch()
    const navigate = useNavigate()

    useEffect(() => {
      const checkRedirect = (isAuth: boolean, isAdmin: boolean) => {
        // 유저정보와 옵션에 따라 페이지 이동
        if (isAuth) {
          // 유저인증 성공인 경우
          if (!isAdmin) {
            // 어드민이 아닌경우
            if (adminRoute) {
              // 어드민 라우트일경우 Redirect
              navigate('/')
            }
            if (option === false) {
              // 인증유저는 접근 못할 경우 Redirect
              navigate('/')
            }
          }
        } else {
          // 유저인증에 실패했을 경우
          if (option) {
            // 인증이 필요한 경우 Redirect
            navigate('/')
          }
        }
      }

      dispatch(userAuth())
        // 유저인증
        .unwrap()
        .then((response) => {
          const { isAdmin } = response.data.userData
          checkRedirect(true, isAdmin === true)
        })
        .catch(() => {
          dispatch(silentRefresh())
            .unwrap()
            .then((response) => {
              const { isAdmin } = response.data.userData
              checkRedirect(true, isAdmin === true)
            })
            .catch(() => checkRedirect(false, false))
        })
    }, [dispatch, navigate])

    return <SpecificComponent {...props} user={user} />
  }
  return React.createElement(AuthenticationCheck)
}

export default withUser
