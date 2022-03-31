import React, { useCallback, useEffect, useRef, useState } from 'react'
import * as S from './Musicbar.style'
import { BiDotsHorizontalRounded } from 'react-icons/bi'
import { IoMdHeart, IoMdHeartEmpty } from 'react-icons/io'
import {
  BsPersonPlus,
  BsPersonPlusFill,
  BsVolumeMuteFill,
  BsVolumeDownFill,
  BsVolumeUpFill,
} from 'react-icons/bs'
import { FaPlay, FaPause, FaStepForward, FaStepBackward } from 'react-icons/fa'
import { RiPlayListFill } from 'react-icons/ri'
import { Link } from 'react-router-dom'
import MusicListDrawer from './section/MusicListDrawer'
import { ShuffleButton, RepeatButton } from './section/SpecialButton'

const musics = [
  {
    name: 'jacinto-1',
    title: '0 Electric Chill Machine',
    artist: 'Jacinto Design',
  },
  {
    name: 'jacinto-2',
    title: '1 Seven Nation Army (Remix)',
    artist: 'Jacinto Design',
  },
  {
    name: 'jacinto-3',
    title: '2 Goodnight, Disco Queen',
    artist: 'Jacinto Design',
  },
  {
    name: 'metric-1',
    title: '3 Front Row (Remix)',
    artist: 'Metric/Jancinto Design',
  },
]

// 로컬스토리지에 저장된 볼륨값을 확인하여 가져오고 없다면 100을 리턴
const getLocalVolume = () => {
  return parseInt(window.localStorage.getItem('volume') || '100')
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const shuffle = (array: any[]) => {
  const arraySize = array.length
  const indexArray = Array.from({ length: arraySize }, (_, i) => i)
  musics.forEach((_, index) => {
    if (index === arraySize - 1) {
      return
    }
    const randomIndex = Math.floor(Math.random() * (arraySize - index) + index)
    const temp = indexArray[index]
    indexArray[index] = indexArray[randomIndex]
    indexArray[randomIndex] = temp
  })

  return indexArray
}

const Musicbar = () => {
  const [isPlay, setIsPlay] = useState(false)
  const [isLike, setIsLike] = useState(false)
  const [isFollow, setIsFollow] = useState(false)
  const [isShuffle, setIsShuffle] = useState(false)
  const [repeat, setRepeat] = useState<undefined | 'one' | 'all'>(undefined)
  const [openMusicList, setOpenMusicList] = useState(false)
  const [indexArray, setIndexArray] = useState(
    Array.from({ length: musics.length }, (_, i) => i)
  )
  const [currentIndex, setCurrentIndex] = useState(0)
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

  const toggleMusicList = () => {
    setOpenMusicList(!openMusicList)
  }

  const toggleLike = () => {
    setIsLike(!isLike)
  }

  const toggleFollow = () => {
    setIsFollow(!isFollow)
  }

  const playMusic = useCallback(async () => {
    setIsPlay(true)
    if (!audioRef.current) {
      return
    }

    await audioRef.current.play()
  }, [])

  const pauseMusic = () => {
    audioRef.current?.pause()
    setIsPlay(false)
  }

  const togglePlay = () => {
    isPlay ? pauseMusic() : playMusic()
  }

  const toggleShuffle = async () => {
    setIsShuffle(!isShuffle)
    if (!isShuffle) {
      setIndexArray(shuffle(indexArray))
      setCurrentIndex(0)
    } else {
      const currentMusicIndex = musics.findIndex(
        (item) => item === musics[indexArray[currentIndex]]
      )
      const currentTime = audioRef.current?.currentTime || 0
      setCurrentIndex(currentMusicIndex)
      setIndexArray(Array.from({ length: musics.length }, (_, i) => i))
      audioRef.current && (audioRef.current.currentTime = currentTime)
    }

    if (isPlay) {
      await audioRef.current?.play()
    }
  }

  const toggleRepeat = () => {
    switch (repeat) {
      case undefined:
        setRepeat('one')
        break
      case 'one':
        setRepeat('all')
        break
      case 'all':
        setRepeat(undefined)
    }
  }

  const changeCurrentIndex = useCallback((changeIndex: number) => {
    setCurrentIndex(changeIndex)
  }, [])

  const nextMusic = () => {
    changeCurrentIndex((currentIndex + 1) % musics.length)
  }

  const prevMusic = () => {
    const calcIndex = currentIndex - 1
    const prevIndex = calcIndex < 0 ? musics.length - 1 : calcIndex
    changeCurrentIndex(prevIndex)
  }

  // 볼륨을 조절하고 변화된 볼륨값을 로컬스토리지에 저장한다.
  const handleChangeVolume = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = event.currentTarget.value
    setVolume(parseInt(newVolume))
    window.localStorage.setItem('volume', newVolume)
  }

  const toggleMute = () => {
    setVolume(volume ? 0 : getLocalVolume())
  }

  // 초단위 시간을 0:00 의 형식의 문자로 반환
  const convertTimeToString = (time: number) => {
    const minutes = Math.floor(time / 60)
    let seconds: number | string = Math.floor(time % 60)
    if (seconds < 10) {
      seconds = `0${seconds}`
    }
    const stringTime = `${minutes}:${seconds}`

    return stringTime
  }

  // 재생중인 음악의 현재시간변화 감지하고 재생이 끝나면 다음 곡을 재생
  const handleChangeAudioTime = (
    event: React.ChangeEvent<HTMLAudioElement>
  ) => {
    const { currentTime, duration } = event.currentTarget

    if (currentTime === duration) {
      // 재생목록의 마지막곡이고 반복재생이 아닌경우는 다음곡 재생을 스킵
      if (repeat === 'one') {
        event.currentTarget.currentTime = 0
        event.currentTarget.play()
        return
      }
      if (!repeat && musics.length - 1 == currentIndex) {
        return togglePlay()
      }
      return nextMusic()
    }

    const newcurrentTime = convertTimeToString(currentTime)
    setProgress({
      ...progress,
      currentTime: newcurrentTime,
      percent: (currentTime / duration) * 100,
    })
  }

  // 새로운 음악을 불러오면 현재시간과 음악전체시간을 초기화
  const handleLoadedMetadata = (event: React.ChangeEvent<HTMLAudioElement>) => {
    const { duration } = event.currentTarget
    const newDuration = convertTimeToString(duration)
    console.log('load')
    setProgress({
      currentTime: '0:00',
      durationTime: newDuration,
      percent: 0,
      duration,
    })
    isPlay && playMusic()
  }

  // 음악 재생막대에서 마우스 이동시 마우스위치에 해당하는 음악시간을 표시해준다.
  const handleMouseMoveProgressbar = (
    event: React.MouseEvent<HTMLDivElement>
  ) => {
    // 현재 마우스 위치
    const clickX = event.nativeEvent.offsetX
    // 현재 마우스 위치의 음악시간
    const mouseTime =
      progress.duration * (clickX / event.currentTarget.clientWidth)
    const mouseStringTime = convertTimeToString(mouseTime)
    setProgressHover({ left: clickX, hover: mouseStringTime })

    return { currentTime: mouseTime, currentStringTime: mouseStringTime }
  }

  const handleMouseLeaveProgressbar = () => {
    setProgressHover({ hover: '', left: 0 })
  }

  // 재생중인 음악을 클릭한 부분에 해당하는 시간에서 재생하도록 한다.
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

  const handleCloseDrawer = useCallback(() => {
    setOpenMusicList(false)
  }, [])

  const handleChangeIndex = useCallback(
    async (changeIndex: number) => {
      await changeCurrentIndex(changeIndex)
      await playMusic()
    },
    [changeCurrentIndex, playMusic]
  )

  // volume state가 변화하면 audio 태그에 자동으로 적용
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume / 100
    }
  }, [volume])

  return (
    <>
      <S.Wrapper id="player">
        <S.Container>
          <audio
            ref={audioRef}
            src={`./music/${musics[indexArray[currentIndex]].name}.mp3`}
            onTimeUpdate={handleChangeAudioTime}
            onLoadedMetadata={handleLoadedMetadata}
          ></audio>

          {/* <!-- Music --> */}
          <S.InfoBox>
            <S.InfoArea>
              {/* Music Image */}
              <div className="img-container">
                <img
                  src={`./img/${musics[indexArray[currentIndex]].name}.jpg`}
                  alt="Album Art"
                />
              </div>
              {/* Music Info */}
              <div className="music-info">
                <h3 id="music-uploader" className="uploader">
                  <Link to="#">{musics[indexArray[currentIndex]].artist}</Link>
                </h3>
                <h2 id="music-title" className="title">
                  <Link to="#">{musics[indexArray[currentIndex]].title}</Link>
                </h2>
              </div>
              {/* Buttons */}
              <div className="music-btns">
                <S.LikeBtn isLike={isLike} onClick={toggleLike}>
                  {isLike ? <IoMdHeart /> : <IoMdHeartEmpty />}
                </S.LikeBtn>
                <S.FollowBtn isFollow={isFollow} onClick={toggleFollow}>
                  {isFollow ? <BsPersonPlusFill /> : <BsPersonPlus />}
                </S.FollowBtn>
                <S.Btn>
                  <BiDotsHorizontalRounded />
                </S.Btn>
              </div>
            </S.InfoArea>
          </S.InfoBox>

          {/* <!-- Controls --> */}
          <S.ControllBox>
            {/* Play Controll */}
            <S.ControllArea>
              <ShuffleButton
                className="btn specialBtn"
                shuffle={isShuffle}
                onClick={toggleShuffle}
              />
              <button className="btn backwardBtn" onClick={prevMusic}>
                <FaStepBackward />
              </button>
              <button className="btn playBtn" onClick={togglePlay}>
                {!isPlay ? <FaPlay /> : <FaPause />}
              </button>
              <button className="btn fowardBtn" onClick={nextMusic}>
                <FaStepForward />
              </button>
              <RepeatButton
                className="btn specialBtn"
                repeat={repeat}
                onClick={toggleRepeat}
              />
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
            <S.PlaylistArea>
              <S.Btn onClick={toggleMusicList}>
                <RiPlayListFill />
              </S.Btn>
            </S.PlaylistArea>
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
      <MusicListDrawer
        open={openMusicList}
        onClose={handleCloseDrawer}
        shuffleBtnProps={{ shuffle: isShuffle, onClick: toggleShuffle }}
        repeatBtnProps={{ repeat, onClick: toggleRepeat }}
        playlistProps={{
          currentIndex,
          onChangeIndex: handleChangeIndex,
          indexArray,
          isPlay,
          togglePlay,
        }}
      />
    </>
  )
}

export default React.memo(Musicbar)
