import { useAppTheme } from '@redux/context/appThemeProvider'
import React from 'react'

const Home = () => {
  const [ThemeMode, toggleTheme] = useAppTheme()
  return (
    <div style={{ height: '100%' }}>
      <h1>Hellow</h1>
      <div>Hellow</div>
      <button onClick={toggleTheme}>{ThemeMode}</button>
    </div>
  )
}

export default Home
