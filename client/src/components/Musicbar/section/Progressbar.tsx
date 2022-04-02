import { setProgress } from '@redux/features/player/playerSlice'
import { useAppDispatch, useAppSelector } from '@redux/hook'
import React, { useState } from 'react'
import convertTimeToString from '@api/functions/convertTimeToString'
import * as S from './Progressbar.style'

export const DurationArea = () => {
  const progress = useAppSelector((state) => state.player.progress)
  return (
    <S.DurationBox>
      <span id="currentTime" className="currentTime">
        {progress.currentStringTime}
      </span>
      <span id="duration" className="duration">
        {progress.durationStringTime}
      </span>
    </S.DurationBox>
  )
}

const Progressbar = () => {
  const progress = useAppSelector((state) => state.player.progress)
  const dispatch = useAppDispatch()

  const [progressHover, setProgressHover] = useState({
    hover: '',
    left: 0,
  })

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

    dispatch(
      setProgress({
        currentStringTime,
        percent: (currentTime / progress.duration) * 100,
      })
    )

    const musicPlayer = document
      .getElementsByTagName('audio')
      .namedItem('wave-music-player')
    if (musicPlayer) {
      musicPlayer.currentTime = currentTime
    }
  }

  return (
    <>
      <S.ProgressBox
        onClick={handleClickProgressbar}
        onMouseMove={handleMouseMoveProgressbar}
        onMouseLeave={handleMouseLeaveProgressbar}
      >
        <span className="hoverTime" style={{ left: `${progressHover.left}px` }}>
          {progressHover.hover}
        </span>
        <div
          className="progress"
          style={{ width: `${progress.percent}%` }}
          data-current={progress.currentStringTime}
        ></div>
      </S.ProgressBox>
      <S.ProgressBackDrop className="progress-backdrop"></S.ProgressBackDrop>
    </>
  )
}

export default Progressbar
