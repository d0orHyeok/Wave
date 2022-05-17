import React from 'react'
import { Provider } from 'react-redux'
import Router from '@routes/router'
import { store } from '@redux/store'
import { GlobalStyle } from '@styles/global-style'
import './styles/font.css'
import { AppThemeProvider } from '@redux/context/appThemeProvider'
import { AlertProvider } from '@redux/context/alertProvider'
import { BrowserRouter } from 'react-router-dom'
import AppView from '@components/AppView/AppView'
import { LoginProvider } from '@redux/context/loginProvider'

function App() {
  return (
    <Provider store={store}>
      <AppThemeProvider>
        <AlertProvider>
          <GlobalStyle />
          <BrowserRouter>
            <LoginProvider>
              <AppView>
                <Router />
              </AppView>
            </LoginProvider>
          </BrowserRouter>
        </AlertProvider>
      </AppThemeProvider>
    </Provider>
  )
}

export default App
