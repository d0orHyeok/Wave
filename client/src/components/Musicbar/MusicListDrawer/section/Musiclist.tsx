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
import {
  setCurrentIndex,
  togglePlay,
  toggleRepeat,
  toggleShuffle,
  removeMusic,
  clearMusics,
} from '@redux/features/player/playerSlice'
import { useAppDispatch, useAppSelector } from '@redux/hook'
import { MusicMenuItem } from '@components/Common/MenuItem'
import { MusicMenu } from '@components/Common/Menu'
import { useToggleLikeMusic } from '@api/ApiUserHooks'
import { useCopyLink } from '@api/MusicHooks'

const Musiclist = () => {
  const backendURI = process.env.REACT_APP_API_URL

  const copyLink = useCopyLink()
  const dispatch = useAppDispatch()
  const toggleLikeMusic = useToggleLikeMusic()

  const likes = useAppSelector((state) => state.user.userData?.likes || [])
  const { isPlay, isShuffle, repeat } = useAppSelector(
    (state) => state.player.controll
  )
  const { currentIndex, indexArray } = useAppSelector(
    (state) => state.player.indexing
  )
  const currentMusic = useAppSelector((state) => state.player.currentMusic)
  const musics = useAppSelector((state) => state.player.musics)

  const [anchorEl, setAnchorEl] = useState<null | HTMLButtonElement>(null)
  const openMenu = Boolean(anchorEl)

  const handleClickPlay = useCallback(
    // 재생목록에서 음악 재생버튼을 누르면 동작
    (index: number) => (event: React.MouseEvent<HTMLElement>) => {
      event.preventDefault()

      if (index === currentIndex) {
        // 재생중인 음악인 경우
        dispatch(togglePlay())
      } else {
        // 재생목록 인덱스를 변경하고 음악을 재생
        dispatch(setCurrentIndex(index))
        dispatch(togglePlay(true))
      }
    },
    [dispatch, currentIndex]
  )

  const handleClickShuffle = useCallback(
    (event: React.MouseEvent<HTMLElement>) => {
      event.preventDefault()
      dispatch(toggleShuffle())
    },
    [dispatch]
  )

  const handleClickRepeat = useCallback(
    (event: React.MouseEvent<HTMLElement>) => {
      event.preventDefault()
      dispatch(toggleRepeat())
    },
    [dispatch]
  )

  const handleClickClear = useCallback(
    (event: React.MouseEvent<HTMLElement>) => {
      event.preventDefault()
      dispatch(clearMusics())
    },
    [dispatch]
  )

  const handleClickItem = useCallback(
    // ...버튼을 누르면 메뉴가 나올 anchor를 설정
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

  const handleClickRemove = () => {
    // 재생목록에서 선택한 음악을 제거
    if (anchorEl) {
      dispatch(removeMusic(Number(anchorEl.value)))
      setAnchorEl(null)
    }
  }

  const handleClickLike = (event: React.MouseEvent<HTMLElement>) => {
    event.preventDefault()
    event.stopPropagation()
    if (anchorEl) {
      const musicId = musics[Number(anchorEl.value)].id
      toggleLikeMusic(musicId)
      setAnchorEl(null)
    } else {
      toggleLikeMusic(Number(event.currentTarget.ariaValueText))
    }
  }

  const handleClickCopy = (event: React.MouseEvent<HTMLElement>) => {
    event.preventDefault()
    event.stopPropagation()
    if (anchorEl) {
      const permalink = musics[Number(anchorEl.value)].permalink
      copyLink(`${window.location.origin}/track/${permalink}`)
    }
    setAnchorEl(null)
  }

  return (
    <>
      {/* 앨범커버 크게보기 */}
      <S.AreaImage className="area-image">
        <S.MusicImage>
          {currentMusic ? (
            <img
              src={
                currentMusic?.cover
                  ? `${backendURI}/${currentMusic.cover}`
                  : 'img/empty-cover.PNG'
              }
              alt="Album Art"
            />
          ) : (
            <></>
          )}
        </S.MusicImage>
      </S.AreaImage>
      {/* 재생목록 영역 */}
      <S.AreaPlaylist className="area-playlist">
        <S.PlaylistHead>
          <h2>재생목록</h2>
          <div className="button-wrap">
            <ShuffleButton
              shuffle={isShuffle}
              className="btn"
              onClick={handleClickShuffle}
            />
            <RepeatButton
              repeat={repeat}
              className="btn"
              onClick={handleClickRepeat}
            />
            <S.ClearBtn onClick={handleClickClear}>Clear</S.ClearBtn>
          </div>
        </S.PlaylistHead>
        <S.PlaylistContainer>
          <ul>
            {indexArray.map((indexItem, index) => (
              <S.PlaylistItem key={index} select={index === currentIndex}>
                <S.ItemImageBox onClick={handleClickPlay(index)}>
                  <img
                    className="image"
                    src={
                      musics[indexItem]?.cover
                        ? `${backendURI}/${musics[indexItem].cover}`
                        : 'img/empty-cover.PNG'
                    }
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
                    <Link to="#">
                      {musics[indexItem]?.uploader
                        ? musics[indexItem].uploader
                        : ''}
                    </Link>
                  </h3>
                  <h2 id="music-title" className="title">
                    <Link to="#">{musics[indexItem]?.title}</Link>
                  </h2>
                </S.ItemInfoBox>
                <S.ItemControlBox>
                  <span className="duration">0:00</span>
                  <LikeFilledButton
                    isLike={likes.includes(musics[indexItem].id)}
                    className="btn"
                    onClick={handleClickLike}
                    aria-valuetext={`${musics[indexItem].id}`}
                  />
                  <button
                    id="playlist-moreBtn"
                    className="btn moreBtn"
                    onClick={handleClickItem}
                    value={indexItem}
                  >
                    <BiDotsHorizontalRounded />
                  </button>
                </S.ItemControlBox>
              </S.PlaylistItem>
            ))}
          </ul>
        </S.PlaylistContainer>
      </S.AreaPlaylist>
      <MusicMenu
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
        <MusicMenuItem onClick={handleClickLike}>
          <IoMdHeart className="icon" />
          <span>Like</span>
        </MusicMenuItem>
        <MusicMenuItem onClick={handleCloseMenu}>
          <BiRepost className="icon" />
          <span>가져오기</span>
        </MusicMenuItem>
        <MusicMenuItem onClick={handleClickCopy}>
          <IoMdLink className="icon" />
          <span>링크 복사</span>
        </MusicMenuItem>
        <MusicMenuItem onClick={handleCloseMenu}>
          <MdPlaylistAdd className="icon" />
          <span>플레이리스트에 추가</span>
        </MusicMenuItem>
        <MusicMenuItem onClick={handleClickRemove}>
          <IoMdClose className="icon" />
          <span>재생목록에서 제거</span>
        </MusicMenuItem>
      </MusicMenu>
    </>
  )
}

export default React.memo(Musiclist)
