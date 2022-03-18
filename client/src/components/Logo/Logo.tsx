import React from 'react'
import { GiSoundWaves } from 'react-icons/gi'
import { Link } from 'react-router-dom'
import styled from 'styled-components'

interface LogoProps {
  className?: string
}

const AppLogo = styled.h1`
  font-size: 32px;
  & .innerLogo {
    display: flex;
    align-items: center;
  }
  & .innerLogo svg {
    color: ${({ theme }) => theme.colors.primaryColor};
    margin-right: 8px;
  }
`

const Logo = ({ className }: LogoProps) => {
  return (
    <AppLogo className={className && className}>
      <Link className="innerLogo" to={'/'}>
        <GiSoundWaves />
        <span className="logo">WAVE</span>
      </Link>
    </AppLogo>
  )
}

export default Logo
