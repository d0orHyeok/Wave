import React from 'react'
import { Provider } from 'react-redux'
import Router from '@routes/router'
import { store } from '@redux/store'
import { GlobalStyle } from '@styles/global-style'
import './styles/font.css'
import { AppThemeProvider } from '@redux/context/appThemeProvider'
import { AlertProvider } from '@redux/context/alertProvider'

function App() {
  return (
    <Provider store={store}>
      <AppThemeProvider>
        <AlertProvider>
          <GlobalStyle />
          <Router />
        </AlertProvider>
      </AppThemeProvider>
    </Provider>
  )
}

export default App
