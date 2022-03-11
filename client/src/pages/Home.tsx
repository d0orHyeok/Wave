import { useAppTheme } from '@redux/context/appThemeProvider'
import React from 'react'

const Home = () => {
  const [ThemeMode, toggleTheme] = useAppTheme()
  return (
    <>
      <h1>Hellow</h1>
      <div>Hellow</div>
      <button onClick={toggleTheme}>{ThemeMode}</button>
    </>
  )
}

export default Home
