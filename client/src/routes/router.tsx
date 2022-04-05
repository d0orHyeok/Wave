import React, { useEffect } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import AppView from '@components/AppView/AppView'
import Home from '@pages/HomePage/Home'
import Register from '@pages/RegisterPage/Register'
import withUser from './authHOC'
import NotFound from '@pages/404'
import { useAppDispatch, useAppSelector } from '@redux/hook'
import { silentRefresh } from '@redux/features/user/userSlice'
import Upload from '@pages/UploadPage/Upload'

const Router = () => {
  const dispatch = useAppDispatch()
  const isLogin = useAppSelector((state) => state.user.isLogin)

  useEffect(() => {
    let interval = null
    if (isLogin === true) {
      interval = setInterval(() => dispatch(silentRefresh()), 1000 * 55)
    } else {
      interval && clearInterval(interval)
      dispatch(silentRefresh())
    }
  }, [dispatch, isLogin])

  return (
    <BrowserRouter>
      <AppView>
        <Routes>
          <Route path="*" element={withUser(NotFound, null)} />
          <Route path="/" element={withUser(Home, null)} />
          <Route path="/home" element={withUser(Home, null)} />
          <Route path="/register" element={withUser(Register, false)} />
          <Route path="/upload" element={withUser(Upload, true)} />
        </Routes>
      </AppView>
    </BrowserRouter>
  )
}

export default Router
