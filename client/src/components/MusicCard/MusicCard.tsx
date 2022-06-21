import calculateDateAgo from '@api/functions/calculateDateAgo'
import { setCurrentMusic, togglePlay } from '@redux/features/player/playerSlice'
import { useAppDispatch, useAppSelector } from '@redux/hook'
import { EmptyMusicCover } from '@styles/EmptyImage'
import React, { useCallback } from 'react'
import { FaPause, FaPlay } from 'react-icons/fa'
import { Link } from 'react-router-dom'
import * as S from './MusicCard.style'
import { BiRepost } from 'react-icons/bi'
import { IMusic, IUser } from '@appTypes/types.type.'

interface MusicCardProps extends React.HTMLAttributes<HTMLDivElement> {
  music: IMusic
  repostUser?: IUser
}

const MusicCard = ({ music, repostUser, ...props }: MusicCardProps) => {
  const dispatch = useAppDispatch()

  const currentMusic = useAppSelector((state) => state.player.currentMusic)
  const isPlay = useAppSelector((state) => state.player.controll.isPlay)

  const handleClickPlay = useCallback(() => {
    if (currentMusic?.id !== music.id) {
      dispatch(setCurrentMusic(music))
      dispatch(togglePlay(true))
    } else {
      dispatch(togglePlay())
    }
  }, [currentMusic?.id, dispatch, music])

  return (
    <S.Container {...props}>
      <div className="musicCard-imageBox">
        <Link
          className="musicCard-imageBox-link"
          to={`/track/${music.userId}/${music.permalink}`}
        >
          {music.cover ? (
            <img
              className="musicCard-imageBox-image"
              src={music.cover}
              alt=""
            />
          ) : (
            <EmptyMusicCover className="musicCard-imageBox-image" />
          )}
        </Link>
      </div>
      <div className="musicCard-infoBox">
        <S.MusicInfo>
          <S.PlayBtn
            className="musicCard-infoBox-play"
            onClick={handleClickPlay}
          >
            {currentMusic?.id === music.id && isPlay ? (
              <FaPause className="icon pause" />
            ) : (
              <FaPlay className="icon play" />
            )}
          </S.PlayBtn>
          <div className="musicCard-infoBox-info">
            <div className="musicCard-uploader">
              <Link to={`/profile/${music.userId}`}>
                {music.user.nickname || music.user.username || music.userId}
              </Link>
              {repostUser ? (
                <>
                  <Link
                    className="musicCard-uploader-repost"
                    to={`/profile/${repostUser.id}`}
                  >
                    <BiRepost className="icon repost" />
                    {repostUser.nickname || repostUser.username}
                  </Link>
                </>
              ) : (
                <></>
              )}
              <div className="musicCard-createdAt">
                {calculateDateAgo(music.createdAt)}
              </div>
            </div>
            <div className="musicCard-title">
              <Link to={`/track/${music.userId}/${music.permalink}`}>
                {music.title}
              </Link>
            </div>
          </div>
        </S.MusicInfo>
        <S.StyledInteractionBar
          className="musicCard-infoBox-interaction"
          target={music}
          mediaSize={1000}
        />
      </div>
    </S.Container>
  )
}

export default MusicCard
