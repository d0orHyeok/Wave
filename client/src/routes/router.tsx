import React, { useLayoutEffect } from 'react'
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import AppView from '@components/AppView/AppView'
import Home from '@pages/HomePage/Home'
import Register from '@pages/RegisterPage/Register'
import withUser from './authHOC'
import NotFound from '@pages/404'
import { useAppDispatch, useAppSelector } from '@redux/hook'
import { silentRefresh, userAuth } from '@redux/features/user/userSlice'
import Upload from '@pages/UploadPage/Upload'

const Router = () => {
  const dispatch = useAppDispatch()
  const location = useLocation()
  const navigate = useNavigate()
  const isLogin = useAppSelector((state) => state.user.isLogin)

  useLayoutEffect(() => {
    if (location.pathname === '/') {
      navigate('/home')
    }

    dispatch(userAuth())
      // 유저인증
      .unwrap()
      .catch(() => {
        dispatch(silentRefresh())
      })
  }, [navigate, dispatch, location.pathname])

  useLayoutEffect(() => {
    let interval = null
    if (isLogin === true) {
      interval = setInterval(() => dispatch(silentRefresh()), 1000 * 60 * 55)
    } else {
      interval && clearInterval(interval)
    }
  }, [dispatch, isLogin])

  return (
    <AppView>
      <Routes>
        <Route path="*" element={<NotFound />} />
        <Route path="/" element={withUser(Home, null)} />
        <Route path="/home" element={withUser(Home, null)} />
        <Route path="/register" element={withUser(Register, false)} />
        <Route path="/upload" element={withUser(Upload, true)} />
      </Routes>
    </AppView>
  )
}

export default Router
