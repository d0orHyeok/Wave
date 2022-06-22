import React, { useCallback, useLayoutEffect } from 'react'
import { useAppDispatch } from '@redux/hook'
import { userAuth } from '@redux/thunks/userThunks'
import { useNavigate } from 'react-router-dom'

const withUser = <P extends object>(
  SpecificComponent: React.ComponentType<P>,
  option: boolean | null
) => {
  function AuthenticationCheck(props: P) {
    const dispatch = useAppDispatch()
    const navigate = useNavigate()

    const authCheck = useCallback(async () => {
      if (!dispatch || !navigate) {
        return
      }
      const { type } = await dispatch(userAuth())
      const isLogin = type.indexOf('fulfilled') !== -1

      if (isLogin) {
        if (option === false) {
          navigate('/')
        }
      } else {
        if (option) {
          navigate('/')
        }
      }
    }, [dispatch, navigate])

    useLayoutEffect(() => {
      authCheck()
    }, [authCheck])

    return <SpecificComponent {...props} />
  }
  return React.createElement(AuthenticationCheck)
}

export default withUser
