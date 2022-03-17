import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import AppView from '@components/AppView/AppView'
import Home from '@pages/HomePage/Home'
import Register from '@pages/RegisterPage/Register'
import withUser from './authHOC'

const router = () => {
  return (
    <BrowserRouter>
      <AppView>
        <Routes>
          <Route path="/" element={withUser(Home, null)} />
          <Route path="/home" element={withUser(Home, null)} />
          <Route path="/register" element={withUser(Register, false)} />
        </Routes>
      </AppView>
    </BrowserRouter>
  )
}

export default router
