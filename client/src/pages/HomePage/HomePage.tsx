import { IMusic } from '@appTypes/types.type.'
import * as S from './HomePage.style'
import React, { useEffect, useState } from 'react'
import MusicSmallCard from '@components/MusicCard/MusicSmallCard'
import { getAllMusic } from '@api/musicApi'
import { Helmet } from 'react-helmet'

// trending, recent_play, new, hot_playlist

const HomePage = () => {
  const [musics, setMusics] = useState<IMusic[]>([])

  useEffect(() => {
    getAllMusic()
      .then((res) => {
        setMusics(res.data)
      })
      .catch((err) => {
        console.log(err.response)
      })
  }, [])

  return (
    <>
      <Helmet>
        <title>Wave | Stream and share to music online</title>
      </Helmet>
      <S.Wrapper>
        <S.Container>
          <h1>Hellow</h1>
          <div>Hellow</div>
          {musics.map((music, index) => (
            <MusicSmallCard key={index} music={music} />
          ))}
        </S.Container>
      </S.Wrapper>
    </>
  )
}

export default React.memo(HomePage)
