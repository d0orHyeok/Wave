import React from 'react'
import { Provider } from 'react-redux'
import Router from '@routes/router'
import { store } from '@redux/store'
import { GlobalStyle } from '@styles/global-style'
import './styles/font.css'
import { AppThemeProvider } from '@redux/context/appThemeProvider'

function App() {
  return (
    <Provider store={store}>
      <GlobalStyle />
      <AppThemeProvider>
        <Router />
      </AppThemeProvider>
    </Provider>
  )
}

export default App
