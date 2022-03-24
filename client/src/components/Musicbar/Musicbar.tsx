import React, { useEffect, useRef, useState } from 'react'
import * as S from './Musicbar.style'
import { AiOutlineHeart, AiFillHeart } from 'react-icons/ai'
import {
  BsPersonPlus,
  BsPersonPlusFill,
  BsVolumeMuteFill,
  BsVolumeDownFill,
  BsVolumeUpFill,
} from 'react-icons/bs'
import { FaPlay, FaPause, FaStepForward, FaStepBackward } from 'react-icons/fa'
import { Link } from 'react-router-dom'

const musics = [
  {
    name: 'jacinto-1',
    displayName: 'Electric Chill Machine',
    artist: 'Jacinto Design',
  },
  {
    name: 'jacinto-2',
    displayName: 'Seven Nation Army (Remix)',
    artist: 'Jacinto Design',
  },
  {
    name: 'jacinto-3',
    displayName: 'Goodnight, Disco Queen',
    artist: 'Jacinto Design',
  },
  {
    name: 'metric-1',
    displayName: 'Front Row (Remix)',
    artist: 'Metric/Jancinto Design',
  },
]

const getLocalVolume = () => {
  return parseInt(window.localStorage.getItem('volume') || '100')
}

const Musicbar = () => {
  const [isPlay, setIsPlay] = useState(false)
  const [isLike, setIsLike] = useState(false)
  const [isFollow, setIsFollow] = useState(false)
  const [musicIndex, setMusicIndex] = useState(0)
  const [progress, setProgress] = useState({
    currentTime: '0:00',
    durationTime: '0:00',
    duration: 0,
    percent: 0,
  })
  const [progressHover, setProgressHover] = useState({
    hover: '',
    left: 0,
  })
  const [volume, setVolume] = useState(getLocalVolume())

  const audioRef = useRef<HTMLAudioElement>(null)
  const volumeRef = useRef<HTMLDivElement>(null)

  const toggleLike = () => {
    setIsLike(!isLike)
  }

  const toggleFollow = () => {
    setIsFollow(!isFollow)
  }

  const playMusic = () => {
    audioRef.current?.play()
  }

  const pauseMusic = () => {
    audioRef.current?.pause()
  }

  const togglePlay = () => {
    setIsPlay(!isPlay)
    isPlay ? pauseMusic() : playMusic()
  }

  const changeMusicIndex = async (changeIndex: number) => {
    // 재생할 음악의 index를 바꾸고 재생중이라면 자동으로 음악을 재생시켜준다.

    await setMusicIndex(changeIndex)
    if (isPlay) {
      playMusic()
    }
  }

  const nextMusic = () => {
    changeMusicIndex((musicIndex + 1) % musics.length)
  }

  const prevMusic = () => {
    const calcIndex = musicIndex - 1
    const prevIndex = calcIndex < 0 ? musics.length - 1 : calcIndex
    changeMusicIndex(prevIndex)
  }

  const handleChangeVolume = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = event.currentTarget.value
    setVolume(parseInt(newVolume))
    window.localStorage.setItem('volume', newVolume)
  }

  const toggleMute = () => {
    setVolume(volume ? 0 : getLocalVolume())
  }

  const convertTimeToString = (time: number) => {
    // 초단위 시간을 0:00 의 형식의 문자로 변환
    const minutes = Math.floor(time / 60)
    let seconds: number | string = Math.floor(time % 60)
    if (seconds < 10) {
      seconds = `0${seconds}`
    }
    const stringTime = `${minutes}:${seconds}`

    return stringTime
  }

  const handleChangeAudioTime = (
    event: React.ChangeEvent<HTMLAudioElement>
  ) => {
    // 재생중인 음악의 현재시간변화 감지
    const { currentTime, duration } = event.currentTarget
    const newcurrentTime = convertTimeToString(currentTime)
    setProgress({
      ...progress,
      currentTime: newcurrentTime,
      percent: (currentTime / duration) * 100,
    })
  }

  const handleLoadedMetadata = (event: React.ChangeEvent<HTMLAudioElement>) => {
    // 새로운 음악을 불러오면 현재시간과 음악전체시간을 초기화
    const { duration } = event.currentTarget
    const newDuration = convertTimeToString(duration)
    setProgress({
      currentTime: '0:00',
      durationTime: newDuration,
      percent: 0,
      duration,
    })
  }

  const handleMouseMoveProgressbar = (
    event: React.MouseEvent<HTMLDivElement>
  ) => {
    const clickX = event.nativeEvent.offsetX
    const mouseTime =
      progress.duration * (clickX / event.currentTarget.clientWidth)
    const mouseStringTime = convertTimeToString(mouseTime)
    setProgressHover({ left: clickX, hover: mouseStringTime })

    return { currentTime: mouseTime, currentStringTime: mouseStringTime }
  }

  const handleMouseLeaveProgressbar = () => {
    setProgressHover({ hover: '', left: 0 })
  }

  const handleClickProgressbar = (evnet: React.MouseEvent<HTMLDivElement>) => {
    const { currentTime, currentStringTime } = handleMouseMoveProgressbar(evnet)
    if (audioRef.current) {
      audioRef.current.currentTime = currentTime
    }
    setProgress({
      ...progress,
      currentTime: currentStringTime,
      percent: (currentTime / progress.duration) * 100,
    })
  }

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume / 100
    }
  }, [volume])

  return (
    <S.Wrapper id="player">
      <S.Container>
        <audio
          ref={audioRef}
          src={`./music/${musics[musicIndex].name}.mp3`}
          onTimeUpdate={handleChangeAudioTime}
          onLoadedMetadata={handleLoadedMetadata}
        ></audio>

        {/* <!-- Music --> */}
        <S.InfoBox>
          <S.InfoArea>
            {/* Music Image */}
            <div className="img-container">
              <img
                src={`./img/${musics[musicIndex].name}.jpg`}
                alt="Album Art"
              />
            </div>
            {/* Music Info */}
            <div className="music-info">
              <h3 id="music-uploader" className="uploader">
                <Link to="#">{musics[musicIndex].artist}</Link>
              </h3>
              <h2 id="music-title" className="title">
                <Link to="#">{musics[musicIndex].displayName}</Link>
              </h2>
            </div>
            {/* Buttons */}
            <div className="music-btns">
              <S.LikeBtn isLike={isLike} onClick={toggleLike}>
                {isLike ? <AiFillHeart /> : <AiOutlineHeart />}
              </S.LikeBtn>
              <S.FollowBtn isFollow={isFollow} onClick={toggleFollow}>
                {isFollow ? <BsPersonPlusFill /> : <BsPersonPlus />}
              </S.FollowBtn>
            </div>
          </S.InfoArea>
        </S.InfoBox>

        {/* <!-- Controls --> */}
        <S.ControllBox>
          {/* Play Controll */}
          <S.ControllArea>
            <button className="btn backwardBtn" onClick={prevMusic}>
              <FaStepBackward />
            </button>
            <button className="btn playBtn" onClick={togglePlay}>
              {!isPlay ? <FaPlay /> : <FaPause />}
            </button>
            <button className="btn fowardBtn" onClick={nextMusic}>
              <FaStepForward />
            </button>
          </S.ControllArea>
        </S.ControllBox>
        <S.SubControllBox>
          {/* Show duration */}
          <S.DurationArea>
            <span id="currentTime" className="currentTime">
              {progress.currentTime}
            </span>
            <span id="duration" className="progressTime">
              {progress.durationTime}
            </span>
          </S.DurationArea>
          {/* Volume Controll */}
          <S.VolumeArea>
            <S.VolumeControll className="volume-controll">
              <div ref={volumeRef} className="volume-container">
                <input
                  type="range"
                  className="volume"
                  min={0}
                  max={100}
                  value={volume}
                  onChange={handleChangeVolume}
                />
              </div>
            </S.VolumeControll>
            <S.Btn onClick={toggleMute}>
              {volume === 0 ? (
                <BsVolumeMuteFill />
              ) : volume > 50 ? (
                <BsVolumeUpFill />
              ) : (
                <BsVolumeDownFill />
              )}
            </S.Btn>
          </S.VolumeArea>
        </S.SubControllBox>

        {/* Progress bar */}
        <S.ProgressBox
          onClick={handleClickProgressbar}
          onMouseMove={handleMouseMoveProgressbar}
          onMouseLeave={handleMouseLeaveProgressbar}
        >
          <span
            className="hoverTime"
            style={{ left: `${progressHover.left}px` }}
          >
            {progressHover.hover}
          </span>
          <div
            className="progress"
            style={{ width: `${progress.percent}%` }}
            data-current={progress.currentTime}
          ></div>
        </S.ProgressBox>
        <S.ProgressBackDrop className="progress-backdrop"></S.ProgressBackDrop>
      </S.Container>
    </S.Wrapper>
  )
}

export default React.memo(Musicbar)
