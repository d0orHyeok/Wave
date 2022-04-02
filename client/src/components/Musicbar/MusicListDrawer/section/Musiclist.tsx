import React, { useCallback, useState } from 'react'
import {
  ShuffleButton,
  RepeatButton,
  LikeFilledButton,
} from '@components/Common/Button'
import * as S from './Musiclist.style'
import { Link } from 'react-router-dom'
import { BiDotsHorizontalRounded, BiRepost } from 'react-icons/bi'
import { IoMdClose, IoMdLink, IoMdHeart } from 'react-icons/io'
import { MdPlaylistAdd } from 'react-icons/md'
import { FaPlay, FaPause } from 'react-icons/fa'
import { setCurrentIndex, togglePlay } from '@redux/features/player/playerSlice'
import { useAppDispatch, useAppSelector } from '@redux/hook'

const Musiclist = () => {
  const dispatch = useAppDispatch()
  const { isPlay, isShuffle, repeat } = useAppSelector(
    (state) => state.player.controll
  )

  const { musics, currentIndex, indexArray } = useAppSelector(
    (state) => state.player.list
  )

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const openMenu = Boolean(anchorEl)

  const handleClickItem = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      if (event.currentTarget.id === 'playlist-moreBtn') {
        setAnchorEl(event.currentTarget)
      }
    },
    []
  )

  const handleCloseMenu = useCallback(() => {
    setAnchorEl(null)
  }, [])

  return (
    <>
      <S.AreaImage className="area-image">
        <S.MusicImage>
          <img
            src={`./img/${musics[indexArray[currentIndex]].name}.jpg`}
            alt="Album Art"
          />
        </S.MusicImage>
      </S.AreaImage>
      <S.AreaPlaylist className="area-playlist">
        <S.PlaylistHead>
          <h2>이어지는 노래</h2>
          <div className="button-wrap">
            <ShuffleButton shuffle={isShuffle} className="btn" />
            <RepeatButton repeat={repeat} className="btn" />
          </div>
        </S.PlaylistHead>
        <S.PlaylistContainer>
          <ul>
            {indexArray.map((indexItem, index) => (
              <S.PlaylistItem key={index} select={index === currentIndex}>
                <S.ItemImageBox
                  onClick={() =>
                    dispatch(
                      index === currentIndex
                        ? togglePlay()
                        : setCurrentIndex(indexItem)
                    )
                  }
                >
                  <img
                    className="image"
                    src={`./img/${musics[indexItem].name}.jpg`}
                    alt="Album Art"
                  />

                  <span className="hoverIcon">
                    {!isPlay || index !== currentIndex ? (
                      <FaPlay />
                    ) : (
                      <FaPause />
                    )}
                  </span>
                </S.ItemImageBox>
                <S.ItemInfoBox>
                  <h3 id="music-uploader" className="uploader">
                    <Link to="#">{musics[indexItem].artist}</Link>
                  </h3>
                  <h2 id="music-title" className="title">
                    <Link to="#">{musics[indexItem].title}</Link>
                  </h2>
                </S.ItemInfoBox>
                <S.ItemControlBox>
                  <span className="duration">0:00</span>
                  <LikeFilledButton className="btn" />
                  <button
                    id="playlist-moreBtn"
                    className="btn moreBtn"
                    onClick={handleClickItem}
                  >
                    <BiDotsHorizontalRounded />
                  </button>
                </S.ItemControlBox>
              </S.PlaylistItem>
            ))}
          </ul>
        </S.PlaylistContainer>
      </S.AreaPlaylist>
      <S.MyMenu
        anchorEl={anchorEl}
        open={openMenu}
        onClose={handleCloseMenu}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        style={{ zIndex: 99999 }}
      >
        <S.MyMenuItem onClick={handleCloseMenu}>
          <IoMdHeart className="icon" />
          <span>Like</span>
        </S.MyMenuItem>
        <S.MyMenuItem onClick={handleCloseMenu}>
          <BiRepost className="icon" />
          <span>가져오기</span>
        </S.MyMenuItem>
        <S.MyMenuItem onClick={handleCloseMenu}>
          <IoMdLink className="icon" />
          <span>링크 복사</span>
        </S.MyMenuItem>
        <S.MyMenuItem onClick={handleCloseMenu}>
          <MdPlaylistAdd className="icon" />
          <span>플레이리스트에 추가</span>
        </S.MyMenuItem>
        <S.MyMenuItem onClick={handleCloseMenu}>
          <IoMdClose className="icon" />
          <span>재생목록에서 제거</span>
        </S.MyMenuItem>
      </S.MyMenu>
    </>
  )
}

export default React.memo(Musiclist)
