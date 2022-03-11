import React, { useState } from 'react'
import * as S from './AppView.style'
import { GiSoundWaves } from 'react-icons/gi'
import { BiAlbum, BiLibrary } from 'react-icons/bi'
import { MdOutlineAddchart } from 'react-icons/md'
import { AiOutlineHome, AiOutlineMenuFold, AiOutlineMenuUnfold } from 'react-icons/ai'
import { Link, useLocation } from 'react-router-dom'
import SearchBox from '@components/SearchBox/SearchBox'

interface AppViewProps {
  children: React.ReactNode
}

const menuItems = [
  { name: 'Home', path: '/home', icon: <AiOutlineHome /> },
  { name: 'Trend', path: '/trend', icon: <MdOutlineAddchart /> },
  { name: 'New Release ', path: '/newrelease', icon: <BiAlbum /> },
  { name: 'Library', path: '/library', icon: <BiLibrary /> },
]

const AppView = ({ children }: AppViewProps) => {
  const location = useLocation()

  const [fold, setFold] = useState(false)
  const toggleFold = () => setFold(!fold)

  return (
    <S.AppWrapper>
      <S.AppHeader id="header" open={!fold}>
        <div className="header-top">
          <S.FoldMenuArea className="header-fold">
            <button className="header-foldBtn" onClick={toggleFold}>
              {fold ? <AiOutlineMenuUnfold /> : <AiOutlineMenuFold />}
            </button>
          </S.FoldMenuArea>
          <S.AppLogo className="header-logo">
            <Link to={'/'}>
              <GiSoundWaves />
              <span className="logo">WAVE</span>
            </Link>
          </S.AppLogo>
        </div>
        <nav className="header-nav">
          <ul>
            {menuItems.map((item, index) => (
              <S.MenuItem key={index} active={location.pathname.includes(item.path)}>
                <Link className="menuItem-link" to={item.path}>
                  {item.icon}
                  {!fold && <span className="menuItem-name">{item.name}</span>}
                </Link>
              </S.MenuItem>
            ))}
          </ul>
        </nav>
      </S.AppHeader>
      <S.AppContainer id="container" open={!fold}>
        <S.FloatBox>
          <SearchBox />
        </S.FloatBox>
        {children}
      </S.AppContainer>
    </S.AppWrapper>
  )
}

export default React.memo(AppView)
