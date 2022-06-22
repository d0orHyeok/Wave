import React from 'react'
import { useAppTheme } from '@redux/context/appThemeProvider'
import { Helmet } from 'react-helmet-async'

const SettingsPage = () => {
  const [ThemeMode, toggleTheme] = useAppTheme()

  return (
    <>
      <Helmet>
        <title>Settings | Wave</title>
      </Helmet>
      <div style={{ height: '100%' }}>
        <h1>Hellow</h1>
        <div>Hellow</div>
        <button onClick={toggleTheme}>{ThemeMode}</button>
      </div>
    </>
  )
}

export default SettingsPage
