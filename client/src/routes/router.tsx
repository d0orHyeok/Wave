import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import AppView from '@components/AppView/AppView'
import Home from '@pages/HomePage/Home'
import Register from '@pages/RegisterPage/Register'
import withUser from './authHOC'
import NotFound from '@pages/404'

const router = () => {
  return (
    <BrowserRouter>
      <AppView>
        <Routes>
          <Route path="/" element={withUser(Home, null)} />
          <Route path="/home" element={withUser(Home, null)} />
          <Route path="/register" element={withUser(Register, false)} />
          <Route path="*" element={withUser(NotFound, null)} />
        </Routes>
      </AppView>
    </BrowserRouter>
  )
}

export default router
