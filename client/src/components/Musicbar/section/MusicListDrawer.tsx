import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import * as S from './MusicListDrawer.style'
import {
  ShuffleButton,
  RepeatButton,
  IShuffleBtnProps,
  IRepeatBtnProps,
} from './SpecialButton'
import { BiDotsHorizontalRounded, BiRepost } from 'react-icons/bi'
import { IoMdClose, IoMdLink, IoMdHeart } from 'react-icons/io'
import { MdPlaylistAdd } from 'react-icons/md'
import { FaPlay, FaPause } from 'react-icons/fa'

interface IPlaylistProps {
  currentIndex: number
  onChangeIndex: (changeIndex: number) => void
  indexArray: number[]
  isPlay: boolean
  togglePlay: () => void
}

interface IMusicListDrawer {
  open: boolean
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onClose: any
  shuffleBtnProps?: IShuffleBtnProps
  repeatBtnProps?: IRepeatBtnProps
  playlistProps: IPlaylistProps
}

const musics = [
  {
    name: 'jacinto-1',
    title: 'Electric Chill Machine',
    artist: 'Jacinto Design',
  },
  {
    name: 'jacinto-2',
    title: 'Seven Nation Army (Remix)',
    artist: 'Jacinto Design',
  },
  {
    name: 'jacinto-3',
    title: 'Goodnight, Disco Queen',
    artist: 'Jacinto Design',
  },
  {
    name: 'metric-1',
    title: 'Front Row (Remix)',
    artist: 'Metric/Jancinto Design',
  },
]

const MusicListDrawer = ({
  open,
  onClose,
  shuffleBtnProps,
  repeatBtnProps,
  playlistProps,
}: IMusicListDrawer) => {
  const { currentIndex, indexArray, isPlay, togglePlay } = playlistProps

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const openMenu = Boolean(anchorEl)

  const handleClickMenu = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (event.currentTarget.id === 'playlist-moreBtn') {
      setAnchorEl(event.currentTarget)
    }
  }

  const handleClose = (event: React.MouseEvent<HTMLElement>) => {
    if (event.target !== event.currentTarget) {
      return
    }
    onClose()
  }

  const handleCloseMenu = () => {
    setAnchorEl(null)
  }

  useEffect(() => {
    const body = document.body
    body.style.overflow = open ? 'hidden' : 'auto'
  }, [open])

  return (
    <>
      <S.Drawer open={open}>
        <S.Container onClick={handleClose}>
          <S.AreaImage className="area-image">
            <S.MusicImage>
              <img src={`./img/${musics[0].name}.jpg`} alt="Album Art" />
            </S.MusicImage>
          </S.AreaImage>
          <S.AreaPlaylist className="area-playlist">
            <S.PlaylistHead>
              <h2>이어지는 노래</h2>
              <div className="button-wrap">
                <ShuffleButton className="btn" {...shuffleBtnProps} />
                <RepeatButton className="btn" {...repeatBtnProps} />
              </div>
            </S.PlaylistHead>
            <S.PlaylistContainer>
              <ul>
                {indexArray.map((indexItem, index) => (
                  <S.PlaylistItem key={index} select={index === currentIndex}>
                    <S.ItemImageBox
                      onClick={
                        index === currentIndex
                          ? togglePlay
                          : () => playlistProps.onChangeIndex(indexItem)
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
                      <S.LikeBtn className="btn">
                        <IoMdHeart />
                      </S.LikeBtn>
                      <button
                        id="playlist-moreBtn"
                        className="btn moreBtn"
                        onClick={handleClickMenu}
                      >
                        <BiDotsHorizontalRounded />
                      </button>
                    </S.ItemControlBox>
                  </S.PlaylistItem>
                ))}
              </ul>
              {open && (
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
              )}
            </S.PlaylistContainer>
          </S.AreaPlaylist>
        </S.Container>
      </S.Drawer>
    </>
  )
}

export default React.memo(MusicListDrawer)
