import React from 'react'
import { Provider } from 'react-redux'
import Router from '@routes/router'
import { store } from '@redux/store'
import { GlobalStyle } from '@styles/global-style'
import './styles/font.css'
import { AppThemeProvider } from '@redux/context/appThemeProvider'
import { AlertProvider } from '@redux/context/alertProvider'
import { BrowserRouter } from 'react-router-dom'
import axios from 'axios'

axios.defaults.baseURL =
  process.env.NODE_ENV === 'development'
    ? '/'
    : `${process.env.REACT_APP_API_URL}`
axios.defaults.withCredentials = true

function App() {
  return (
    <Provider store={store}>
      <AppThemeProvider>
        <AlertProvider>
          <GlobalStyle />
          <BrowserRouter>
            <Router />
          </BrowserRouter>
        </AlertProvider>
      </AppThemeProvider>
    </Provider>
  )
}

export default App
