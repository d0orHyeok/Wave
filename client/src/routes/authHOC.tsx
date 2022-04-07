import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppSelector } from '@redux/hook'
import { selectUser } from '@redux/features/user/userSlice'

const withUser = <P extends object>(
  SpecificComponent: React.ComponentType<P>,
  option: boolean | null
) => {
  function AuthenticationCheck(props: P) {
    const user = useAppSelector(selectUser)
    const navigate = useNavigate()

    useEffect(() => {
      if (user.isLogin && user.userData) {
        if (option === false) {
          navigate('/')
        }
      } else {
        if (option) {
          navigate('/')
        }
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return <SpecificComponent {...props} />
  }
  return React.createElement(AuthenticationCheck)
}

export default withUser
