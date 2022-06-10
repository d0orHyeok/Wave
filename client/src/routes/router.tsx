import React, { useEffect } from 'react'
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import HomePage from '@pages/HomePage/HomePage'
import RegisterPage from '@pages/RegisterPage/RegisterPage'
import withUser from './authHOC'
import NotFoundPage from '@pages/NotFoundPage'
import { useAppDispatch } from '@redux/hook'
import { userAuth } from '@redux/thunks/userThunks'
import UploadPage from '@pages/UploadPage/UploadPage'
import SettingsPage from '@pages/SettingsPage/SettingsPage'
import TrackPage from '@pages/TrackPage/TrackPage'
import ProfilePage from '@pages/ProfilePage/ProfilePage'
import SearchPage from '@pages/SearchPage/SearchPage'
import PlaylistPage from '@pages/PlaylistPage/PlaylistPage'
import TrackDetailPage from '@pages/TrackDetailPage/TrackDetailPage'
import PlaylistDetailPage from '@pages/PlaylistDetailPage/playlistDetailPage'

const Router = () => {
  const dispatch = useAppDispatch()
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    if (location.pathname === '/') {
      navigate('/home')
    }
    dispatch(userAuth())
  }, [navigate, dispatch, location.pathname])

  return (
    <Routes>
      <Route path="*" element={<NotFoundPage />} />
      <Route path="/" element={<HomePage />} />
      <Route path="/home" element={<HomePage />} />
      <Route path="/register" element={withUser(RegisterPage, false)} />
      <Route path="/upload" element={withUser(UploadPage, true)} />
      <Route path="/settings" element={withUser(SettingsPage, true)}></Route>
      {/* Track Page */}
      <Route path="/track/:userId/:permalink" element={<TrackPage />} />
      <Route
        path="/track/:userId/:permalink/:detail"
        element={<TrackDetailPage />}
      />
      <Route path="/track/notfound" element={<NotFoundPage />} />
      {/* Profile Page */}
      <Route path="/profile/:userId" element={<ProfilePage />}>
        <Route path=":nav" element={<ProfilePage />} />
      </Route>
      {/* Playlsit Page */}
      <Route path="/playlist/notfound" element={<NotFoundPage />} />
      <Route path="/playlist/:userId/:permalink" element={<PlaylistPage />} />
      <Route
        path="/playlist/:userId/:permalink/:detail"
        element={<PlaylistDetailPage />}
      />
      {/* Search Page */}
      <Route path="/search" element={<SearchPage />}></Route>
    </Routes>
  )
}

export default Router
