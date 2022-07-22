import React, { useLayoutEffect, useState } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import TagTracks from './sections/TagTracks'
import { Helmet } from 'react-helmet-async'
import * as S from './TagPage.style'
import { RiCheckboxMultipleBlankFill } from 'react-icons/ri'
import { BsSoundwave } from 'react-icons/bs'
import TagPlaylists from './sections/TagPlaylists'

const navItems = [
  { text: 'Tracks', icon: <BsSoundwave className="icon" /> },
  {
    path: 'playlists',
    text: 'Playlists',
    icon: <RiCheckboxMultipleBlankFill className="icon" />,
  },
]

const TagPage = () => {
  const { tag, nav } = useParams()
  const navigate = useNavigate()

  const [title, setTitle] = useState(`New tracks tagged #${tag}`)

  useLayoutEffect(() => {
    if (!nav) {
      setTitle(`New tracks tagged #${tag}`)
    } else if (nav === 'playlists') {
      setTitle(`Playlists tagged #${tag}`)
    } else {
      navigate(`/tag/${tag}%2F${nav}`)
    }
  }, [nav, navigate, tag])

  return (
    <>
      <Helmet>
        <title>{`Music tracks, playlists tagged ${tag} | Wave`}</title>
      </Helmet>
      <S.Wrapper>
        <S.Head>{title}</S.Head>
        <S.Navbar>
          <ul>
            {navItems.map((item, index) => (
              <li key={index} className={nav === item.path ? 'select' : ''}>
                <Link to={`/tags/${tag}${item.path ? `/${item.path}` : ''}`}>
                  {item.icon}
                  <span className="text">{item.text}</span>
                </Link>
              </li>
            ))}
          </ul>
        </S.Navbar>
        <S.Container>
          {!nav ? (
            <TagTracks tag={tag || ''} />
          ) : nav === 'playlists' ? (
            <TagPlaylists tag={tag || ''} />
          ) : (
            <></>
          )}
        </S.Container>
      </S.Wrapper>
    </>
  )
}

export default TagPage
