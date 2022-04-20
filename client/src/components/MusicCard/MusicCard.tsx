import { IMusic } from '@redux/features/player/palyerSlice.interface'
import React, { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import * as S from './MusicCard.style'
import { FaPlay, FaPause } from 'react-icons/fa'
import { useAppDispatch, useAppSelector } from '@redux/hook'
import {
  addMusic,
  setCurrentMusic,
  togglePlay,
} from '@redux/features/player/playerSlice'
import { MusicMenuItem } from '@components/Common/MenuItem'
import { MusicMenu } from '@components/Common/Menu'
import { MdPlaylistPlay, MdPlaylistAdd } from 'react-icons/md'
import { IoMdHeart } from 'react-icons/io'
import { BiDotsHorizontalRounded } from 'react-icons/bi'

interface IMusicCardProps {
  music: IMusic
  style?: React.CSSProperties
}

const MusicCard = ({ music, style }: IMusicCardProps) => {
  const dispatch = useAppDispatch()

  const currentMusic = useAppSelector((state) => state.player.currentMusic)
  const isPlay = useAppSelector((state) => state.player.controll.isPlay)

  const [cardIsCurrentMusic, setCardIsCurrentMusic] = useState(false)
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)

  const openMenu = Boolean(anchorEl)

  const handleCloseMenu = useCallback(() => {
    setAnchorEl(null)
  }, [])

  const handleClickPlay = async (event: React.MouseEvent<HTMLElement>) => {
    event.preventDefault()
    event.stopPropagation()
    dispatch(setCurrentMusic(music))
    if (cardIsCurrentMusic) {
      dispatch(togglePlay())
    } else {
      dispatch(togglePlay(true))
    }
  }

  const handleClickMore = useCallback(
    (event: React.MouseEvent<HTMLElement>) => {
      event.stopPropagation()
      event.preventDefault()
      setAnchorEl(event.currentTarget)
    },
    []
  )

  const handleClickPushMusic = useCallback(() => {
    dispatch(addMusic(music))
    setAnchorEl(null)
  }, [dispatch, music])

  useEffect(() => {
    if (music.id === currentMusic?.id) {
      setCardIsCurrentMusic(true)
    } else {
      setCardIsCurrentMusic(false)
    }
  }, [currentMusic?.id, music])

  return (
    <>
      <S.CardContainer style={style}>
        <Link to={`/track/${music.permalink}`}>
          <S.ImageBox>
            <img
              src={
                music?.cover
                  ? `${process.env.REACT_APP_API_URL}/${music.cover}`
                  : 'img/empty-cover.PNG'
              }
              alt="cover"
            />
            <S.CardPlayButton
              className="cardHoverBtn"
              onClick={handleClickPlay}
            >
              {!cardIsCurrentMusic || !isPlay ? (
                <FaPlay style={{ marginLeft: '2px' }} />
              ) : (
                <FaPause />
              )}
            </S.CardPlayButton>
            <S.CardMoreButton
              className="cardHoverBtn"
              onClick={handleClickMore}
            >
              <BiDotsHorizontalRounded />
            </S.CardMoreButton>
          </S.ImageBox>
        </Link>
        <S.CartInfoBox>
          <Link to={`/track/${music.permalink}`}>
            <div className="musicCard-title">{music.title}</div>
          </Link>
        </S.CartInfoBox>
      </S.CardContainer>
      {openMenu ? (
        <MusicMenu
          anchorEl={anchorEl}
          open={openMenu}
          onClose={handleCloseMenu}
        >
          <MusicMenuItem onClick={handleCloseMenu}>
            <IoMdHeart className="icon" />
            <span>Like</span>
          </MusicMenuItem>
          <MusicMenuItem onClick={handleClickPushMusic}>
            <MdPlaylistPlay className="icon" />
            <span>재생목록에 추가</span>
          </MusicMenuItem>
          <MusicMenuItem onClick={handleCloseMenu}>
            <MdPlaylistAdd className="icon" />
            <span>플레이리스트에 추가</span>
          </MusicMenuItem>
        </MusicMenu>
      ) : (
        <></>
      )}
    </>
  )
}

export default MusicCard
