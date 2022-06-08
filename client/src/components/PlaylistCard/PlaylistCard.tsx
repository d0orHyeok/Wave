import { PrimaryButton } from '@components/Common/Button'
import InteractionButtons from '@components/InteractionBar/InteractionButtons'
import { IPlaylist } from '@redux/features/player/palyerSlice.interface'
import { EmptyPlaylistImage, EmptyMusicCover } from '@styles/EmptyImage'
import React, { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import { FaPlay, FaPause } from 'react-icons/fa'
import { numberFormat } from '@api/functions'
import { useAppDispatch, useAppSelector } from '@redux/hook'
import {
  addMusic,
  clearMusics,
  setCurrentMusic,
  togglePlay,
} from '@redux/features/player/playerSlice'

const Container = styled.div`
  padding: 10px 0;
  display: flex;
`

const ImageBox = styled.div`
  flex-shrink: 0;
  margin-right: 10px;

  & .link,
  & .img {
    width: 100%;
    height: 100%;
  }
`

const PlaylistImageBox = styled(ImageBox)`
  width: 140px;
  height: 140px;

  ${({ theme }) => theme.device.tablet} {
    width: 100px;
    height: 100px;
  }
`

const MusicImageBox = styled(ImageBox)`
  width: 20px;
  height: 20px;
`

const PlaylistCardInfo = styled.div`
  width: 100%;
  min-width: 0;

  & .playlist-info {
    & .playlist-info-user {
      font-size: 14px;
      color: ${({ theme }) => theme.colors.bgTextRGBA(0.6)};

      &:hover {
        color: ${({ theme }) => theme.colors.bgTextRGBA(0.86)};
      }
    }

    & .playlist-info-name {
      font-size: 16px;
      color: ${({ theme }) => theme.colors.bgText};
    }

    & .playlist-info-user,
    & .playlist-info-name {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    &:after {
      content: '';
      display: block;
      clear: both;
    }
  }
`

const PlayBtn = styled(PrimaryButton)`
  font-size: 20px;
  float: left;

  height: 40px;
  width: 40px;
  border-radius: 20px;
  margin-right: 10px;

  & .icon.play {
    transform: translateX(2px);
  }
`

const PlaylistMusicUl = styled.ul`
  margin-top: 10px;
  border: 1px solid ${({ theme }) => theme.colors.border1};

  & .playlist-musicItem {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    height: 30px;
    padding: 0 5px;

    &:not(:last-child) {
      border-bottom: 1px solid ${({ theme }) => theme.colors.border1};
    }

    & .musicItem-info {
      font-size: 13px;
      color: ${({ theme }) => theme.colors.bgTextRGBA(0.86)};

      &.musicItem-index {
        flex-shrink: 0;
        margin-right: 5px;
      }

      &.musicItem-uploader {
        flex-shrink: 0;
        color: ${({ theme }) => theme.colors.bgTextRGBA(0.6)};
        &:hover {
          color: inherit;
        }

        ${({ theme }) => theme.device.mobile} {
          display: none;
        }

        &::after {
          content: '-';
          color: ${({ theme }) => theme.colors.bgTextRGBA(0.86)};
          margin: 0 4px;
        }
      }

      &.musicItem-title {
        min-width: 0;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        margin-right: auto;
      }

      &.musicItem-play {
        margin-left: 4px;
        flex-shrink: 0;

        & .icon.play {
          font-size: 10px;
          margin-right: 3px;
        }

        @media screen and (max-width: 600px) {
          display: none;
        }
      }
    }
  }

  & .viewMore {
    border: none;
    width: 100%;
    padding: 5px 0;
    font-size: 13px;
    text-align: center;
    cursor: pointer;
    color: ${({ theme }) => theme.colors.bgTextRGBA(0.6)};

    &:hover {
      color: ${({ theme }) => theme.colors.bgText};
    }
  }
`

const StyledInteractionButtons = styled(InteractionButtons)`
  margin-top: 10px;
`

interface PlaylistCardProps {
  playlist: IPlaylist
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setPlaylist?: any
}

const PlaylistCard = ({ playlist, setPlaylist }: PlaylistCardProps) => {
  const dispatch = useAppDispatch()

  const isPlay = useAppSelector((state) => state.player.controll.isPlay)
  const playerMusics = useAppSelector((state) => state.player.musics)

  const [playlistMusics, setPlaylistMusics] = useState(
    playlist.musics?.slice(0, 5) || []
  )
  const [playlistPlay, setPlaylistPlay] = useState(false)

  const handleClickPlay = () => {
    if (!playlist.musics || playlist.musics.length === 0) {
      return
    }

    if (!playlistPlay) {
      dispatch(clearMusics())
      dispatch(addMusic(playlist.musics))
      dispatch(setCurrentMusic(playlist.musics[0]))
      dispatch(togglePlay(true))
      setPlaylistPlay(true)
    } else {
      dispatch(togglePlay())
    }
  }

  const handleClickViewMore = useCallback(() => {
    if (!playlist.musics || !playlist.musics.length) {
      return
    }

    playlistMusics.length > 5
      ? setPlaylistMusics(playlist.musics.slice(0, 5))
      : setPlaylistMusics(playlist.musics)
  }, [playlist.musics, playlistMusics.length])

  useEffect(() => {
    if (playlist.musics?.length === playerMusics.length) {
      let bol = true
      for (let i = 0; i < playlist.musics.length; i++) {
        if (
          playerMusics.findIndex((m) => m.id === playlist.musics[i].id) === -1
        ) {
          bol = false
          break
        }
      }
      setPlaylistPlay(bol)
    } else {
      setPlaylistPlay(false)
    }
  }, [playerMusics, playlist.musics])

  return (
    <Container>
      <PlaylistImageBox className="imageBox">
        <Link
          to={`/playlist/${playlist.userId}/${playlist.permalink}`}
          className="link"
        >
          {playlist.image ? (
            <img className="img" src={playlist.image} alt="" />
          ) : (
            <EmptyPlaylistImage className="img" />
          )}
        </Link>
      </PlaylistImageBox>
      <PlaylistCardInfo className="playlistCard-info">
        <PlayBtn onClick={handleClickPlay}>
          {isPlay && playlistPlay ? (
            <FaPause className="icon pause" />
          ) : (
            <FaPlay className="icon play" />
          )}
        </PlayBtn>
        <div className="playlist-info">
          <div className="playlist-info-user">
            <Link to={`/profile/${playlist.userId}`}>
              {playlist.user.nickname || playlist.user.username}
            </Link>
          </div>
          <div className="playlist-info-name">
            <Link to={`/playlist/${playlist.userId}/${playlist.permalink}`}>
              {playlist.name}
            </Link>
          </div>
        </div>
        {!playlistMusics || playlistMusics.length === 0 ? (
          <></>
        ) : (
          <PlaylistMusicUl className="playlist-musics">
            {playlistMusics.map((music, index) => (
              <li key={index} className="playlist-musicItem">
                <MusicImageBox>
                  <Link
                    className="link"
                    to={`/track/${music.userId}/${music.permalink}`}
                  >
                    {music.cover ? (
                      <img className="img" src={music.cover} alt="" />
                    ) : (
                      <EmptyMusicCover className="img" />
                    )}
                  </Link>
                </MusicImageBox>
                <div className="musicItem-info musicItem-index">{index}</div>
                <div className="musicItem-info musicItem-uploader">
                  <Link to={`/profile/${music.userId}`}>
                    {music.user.nickname || music.user.username}
                  </Link>
                </div>
                <Link
                  className="musicItem-info musicItem-title"
                  to={`/track/${music.userId}/${music.permalink}`}
                >
                  {music.title}
                </Link>
                {music.count ? (
                  <div className="musicItem-info musicItem-play">
                    <FaPlay className="icon play" />
                    {numberFormat(music.count)}
                  </div>
                ) : (
                  <></>
                )}
              </li>
            ))}
            {playlist.musics.length > 5 ? (
              <button
                className="viewMore"
                onClick={handleClickViewMore}
              >{`View ${
                playlistMusics.length > 5 ? 'fewer' : playlist.musics.length - 5
              } tracks`}</button>
            ) : (
              <></>
            )}
          </PlaylistMusicUl>
        )}
        <StyledInteractionButtons
          target={playlist}
          setTarget={setPlaylist}
          mediaSize={800}
        />
      </PlaylistCardInfo>
    </Container>
  )
}

export default PlaylistCard
