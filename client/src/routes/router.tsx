import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import AppView from '@components/AppView/AppView'
import Home from '@pages/HomePage/Home'
import Register from '@pages/RegisterPage/Register'

const router = () => {
  return (
    <BrowserRouter>
      <AppView>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Home />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </AppView>
    </BrowserRouter>
  )
}

export default router
