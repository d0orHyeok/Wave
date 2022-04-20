import Axios from '@api/Axios'
import { IMusic } from '@redux/features/player/palyerSlice.interface'
import * as S from './HomePage.style'
import React, { useEffect, useState } from 'react'
import MusicCard from '@components/MusicCard/MusicCard'

// trending, recent_play, new, hot_playlist

const HomePage = () => {
  const [musics, setMusics] = useState<IMusic[]>([])

  useEffect(() => {
    Axios.get('/api/music/')
      .then((res) => {
        setMusics(res.data.musics)
      })
      .catch((err) => {
        console.log(err)
      })
  }, [])

  return (
    <S.Wrapper>
      <S.Container>
        <h1>Hellow</h1>
        <div>Hellow</div>
        {musics.map((music, index) => (
          <MusicCard key={index} music={music} />
        ))}
      </S.Container>
    </S.Wrapper>
  )
}

export default React.memo(HomePage)
