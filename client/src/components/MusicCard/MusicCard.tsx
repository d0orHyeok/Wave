import { IMusic } from '@redux/features/player/palyerSlice.interface'
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import * as S from './MusicCard.style'
import { FaPlay, FaPause } from 'react-icons/fa'
import { useAppDispatch, useAppSelector } from '@redux/hook'
import { setCurrentMusic, togglePlay } from '@redux/features/player/playerSlice'
import {
  AddMusicMenuItem,
  AddPlaylistMenuItem,
} from '@components/Common/MenuItem'
import { MusicMenu } from '@components/Common/Menu'
import { useToggleLikeMusic } from '@api/ApiUserHooks'
import { LikeFilledButton, MoreButton } from '@components/Common/Button'

interface IMusicCardProps {
  music: IMusic
  style?: React.CSSProperties
}

const MusicCard = ({ music, style }: IMusicCardProps) => {
  const dispatch = useAppDispatch()
  const toggleLikeMusic = useToggleLikeMusic()

  const currentMusic = useAppSelector((state) => state.player.currentMusic)
  const isPlay = useAppSelector((state) => state.player.controll.isPlay)
  const likes = useAppSelector((state) => state.user.userData?.likes) || []

  const [cardIsCurrentMusic, setCardIsCurrentMusic] = useState(false)
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)

  const openMenu = Boolean(anchorEl)

  const handleCloseMenu = () => {
    setAnchorEl(null)
  }

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

  const handleClickMore = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation()
    event.preventDefault()
    setAnchorEl(event.currentTarget)
  }

  const handleClickLike = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation()
    event.preventDefault()
    toggleLikeMusic(music.id)
  }

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
        <S.ImageBox>
          <Link to={`/track/${music.permalink}`}>
            <img
              src={
                music?.cover
                  ? `${process.env.REACT_APP_API_URL}/${music.cover}`
                  : 'img/empty-cover.PNG'
              }
              alt="cover"
            />
            <S.CardPlayButton
              isPlay={cardIsCurrentMusic.toString()}
              className="cardHoverBtn"
              onClick={handleClickPlay}
            >
              {!cardIsCurrentMusic || !isPlay ? (
                <FaPlay style={{ marginLeft: '2px' }} />
              ) : (
                <FaPause />
              )}
            </S.CardPlayButton>
            <S.CardHoverControl className="cardHoverControldd">
              <LikeFilledButton
                isLike={likes.includes(music.id)}
                onClick={handleClickLike}
              />
              <MoreButton
                onClick={handleClickMore}
                style={{ fontSize: '1.2em' }}
              />
            </S.CardHoverControl>
          </Link>
        </S.ImageBox>
        <S.CartInfoBox>
          <div className="musicCard-title">
            <Link to={`/track/${music.permalink}`}>{music.title} </Link>
          </div>
          <div className="musicCard-uploader">
            <Link to={`/people/${music.uploader}`}>{music.uploader} </Link>
          </div>
        </S.CartInfoBox>
      </S.CardContainer>

      <MusicMenu anchorEl={anchorEl} open={openMenu} onClose={handleCloseMenu}>
        <AddMusicMenuItem music={music} onClose={handleCloseMenu} />
        <AddPlaylistMenuItem onClose={handleCloseMenu} />
      </MusicMenu>
    </>
  )
}

export default MusicCard
