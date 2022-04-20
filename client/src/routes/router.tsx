import React, { useLayoutEffect, useEffect } from 'react'
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import AppView from '@components/AppView/AppView'
import HomePage from '@pages/HomePage/HomePage'
import RegisterPage from '@pages/RegisterPage/RegisterPage'
import withUser from './authHOC'
import NotFoundPage from '@pages/NotFoundPage'
import { useAppDispatch, useAppSelector } from '@redux/hook'
import { silentRefresh, userAuth } from '@redux/features/user/userSlice'
import UploadPage from '@pages/UploadPage/UploadPage'
import SettingsPage from '@pages/SettingsPage/SettingsPage'
import TrackPage from '@pages/TrackPage/TrackPage'

const Router = () => {
  const dispatch = useAppDispatch()
  const location = useLocation()
  const navigate = useNavigate()
  const isLogin = useAppSelector((state) => state.user.isLogin)

  useEffect(() => {
    if (location.pathname === '/') {
      navigate('/home')
    }
    dispatch(userAuth())
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
        <Route path="*" element={<NotFoundPage />} />
        <Route path="/" element={withUser(HomePage, null)} />
        <Route path="/home" element={withUser(HomePage, null)} />
        <Route path="/register" element={withUser(RegisterPage, false)} />
        <Route path="/upload" element={withUser(UploadPage, true)} />
        <Route path="/settings" element={withUser(SettingsPage, true)} />
        <Route path="/track/*" element={withUser(TrackPage, null)} />
      </Routes>
    </AppView>
  )
}

export default Router
