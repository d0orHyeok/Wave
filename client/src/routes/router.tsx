import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Home from '@pages/Home'
import Navbar from '@components/Navbar/Navbar'

const router = () => {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </BrowserRouter>
  )
}

export default router
