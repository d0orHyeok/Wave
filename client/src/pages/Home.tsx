import { useAppTheme } from '@redux/context/appThemeProvider'
import React from 'react'
import styled from 'styled-components'

const TestBtn = styled.button`
  background-color: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.primaryText};
  border: 1px solid ${({ theme }) => theme.colors.borderColor};
`

const Home = () => {
  const [ThemeMode, toggleTheme] = useAppTheme()
  return (
    <>
      <h1>Hellow</h1>
      <div>Hellow</div>
      <TestBtn onClick={toggleTheme}>{ThemeMode}</TestBtn>
    </>
  )
}

export default Home
