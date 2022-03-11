import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Home from '@pages/Home'
import AppView from '@components/AppView/AppView'
// import Navbar from '@components/Navbar/Navbar'

const router = () => {
  return (
    <BrowserRouter>
      <AppView>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Home />} />
        </Routes>
      </AppView>
    </BrowserRouter>
  )
}

export default router
