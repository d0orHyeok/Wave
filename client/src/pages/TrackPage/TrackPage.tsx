import Axios from '@api/Axios'
import { IMusic } from '@redux/features/player/palyerSlice.interface'
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import TrackHead from './TrackHead/TrackHead'
import * as S from './TrackPage.style'

const TrackPage = () => {
  const { '*': permalink } = useParams()
  const navigate = useNavigate()

  const [music, setMusic] = useState<IMusic>()

  useEffect(() => {
    Axios.get(`/api/music/${permalink}`)
      .then((res) => setMusic(res.data))
      .catch(() => navigate('/track/notfound'))
  }, [navigate, permalink])

  return (
    <S.Wrapper>
      <TrackHead music={music} />
      <div>{music?.title}</div>
    </S.Wrapper>
  )
}

export default React.memo(TrackPage)
