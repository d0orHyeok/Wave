import React, { useEffect, useState } from 'react'
import * as S from './AppView.style'
import { BiAlbum, BiLibrary } from 'react-icons/bi'
import { MdOutlineAddchart } from 'react-icons/md'
import {
  AiOutlineHome,
  AiOutlineMenuFold,
  AiOutlineMenuUnfold,
} from 'react-icons/ai'
import { Link, useLocation } from 'react-router-dom'
import SearchBox from '@components/AppView/section/SearchBox'
import Logo from '@components/Logo/Logo'
import { debounce } from 'lodash'
import ProfileArea from './section/ProfileArea'
import Footer from '../Footer/Footer'
import Musicbar from '@components/Musicbar/Musicbar'

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

  const [windowWidth, setWindowWidth] = useState(window.innerWidth)
  const [fold, setFold] = useState(
    window.localStorage.getItem('fold') === 'true'
  )

  const toggleFold = () => {
    window.localStorage.setItem('fold', `${!fold}`)
    setFold(!fold)
  }

  const handleResize = debounce(() => {
    setWindowWidth(window.innerWidth)
  }, 100)

  useEffect(() => {
    if (windowWidth < 1200) {
      setFold(true)
    } else {
      setFold(window.localStorage.getItem('fold') === 'true')
    }
    window.addEventListener('resize', handleResize)
    return () => {
      window.removeEventListener('resize', handleResize)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [windowWidth, location.pathname])

  return (
    <S.AppWrapper>
      <S.AppHeader id="header" fold={fold}>
        <div className="header-top">
          <S.FoldMenuArea className="header-fold">
            <button className="header-foldBtn" onClick={toggleFold}>
              {fold ? <AiOutlineMenuUnfold /> : <AiOutlineMenuFold />}
            </button>
          </S.FoldMenuArea>
          <Logo className="header-logo" />
          <ProfileArea fold={fold} />
        </div>
        <nav className="header-nav">
          <ul>
            {menuItems.map((item, index) => (
              <S.MenuItem
                key={index}
                active={location.pathname.includes(item.path)}
              >
                <Link className="menuItem-link" to={item.path}>
                  {item.icon}
                  {!fold && <span className="menuItem-name">{item.name}</span>}
                </Link>
              </S.MenuItem>
            ))}
          </ul>
        </nav>
      </S.AppHeader>
      <S.FloatBox fold={fold}>
        <div className="floatbox-container">
          <Logo className="float-logo" />
          <SearchBox className="float-search" windowWidth={windowWidth} />
        </div>
      </S.FloatBox>
      <S.AppContainer id="container" fold={fold}>
        <S.MainContent>{children}</S.MainContent>
        <Footer />
      </S.AppContainer>
      <Musicbar />
      <S.Backdrop
        fold={fold}
        role="presentation"
        className="app-backdrop"
        onClick={toggleFold}
      ></S.Backdrop>
    </S.AppWrapper>
  )
}

export default React.memo(AppView)
