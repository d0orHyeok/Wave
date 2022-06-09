import * as S from './PlaylistCard.style'
import { IPlaylist } from '@redux/features/player/palyerSlice.interface'
import { EmptyPlaylistImage, EmptyMusicCover } from '@styles/EmptyImage'
import React, { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { FaPlay, FaPause } from 'react-icons/fa'
import { numberFormat } from '@api/functions'
import { useAppDispatch, useAppSelector } from '@redux/hook'
import {
  addMusic,
  clearMusics,
  setCurrentMusic,
  togglePlay,
} from '@redux/features/player/playerSlice'

interface PlaylistCardProps extends React.HTMLAttributes<HTMLDivElement> {
  playlist: IPlaylist
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setPlaylist?: any
}

const PlaylistCard = ({
  playlist,
  setPlaylist,
  ...props
}: PlaylistCardProps) => {
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
    <S.Container {...props}>
      <S.PlaylistImageBox>
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
      </S.PlaylistImageBox>
      <S.PlaylistCardInfo className="playlistCard-info">
        <S.PlayBtn onClick={handleClickPlay}>
          {isPlay && playlistPlay ? (
            <FaPause className="icon pause" />
          ) : (
            <FaPlay className="icon play" />
          )}
        </S.PlayBtn>
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
          <S.PlaylistMusicUl className="playlist-musics">
            {playlistMusics.map((music, index) => (
              <li key={index} className="playlist-musicItem">
                <S.MusicImageBox>
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
                </S.MusicImageBox>
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
          </S.PlaylistMusicUl>
        )}
        <S.StyledInteractionButtons
          target={playlist}
          setTarget={setPlaylist}
          mediaSize={800}
        />
      </S.PlaylistCardInfo>
    </S.Container>
  )
}

export default PlaylistCard
