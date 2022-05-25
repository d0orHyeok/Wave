import { IMusic } from '@redux/features/player/palyerSlice.interface'
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import TrackHead from './TrackHead/TrackHead'
import styled from 'styled-components'
import Loading from '@components/Loading/Loading'
import CommentBox from '@components/CommentBox/CommentBox'
import InteractionBar from '@components/InteractionBar/InteractionBar'
import { getMusicByPermalink } from '@api/musicApi'

const Wrapper = styled.div`
  min-height: 100%;
  max-width: 1200px;
  width: 100%;
  margin: auto;
`

const Content = styled.div`
  display: flex;
`

const TrackPage = () => {
  const { '*': permalink } = useParams()
  const navigate = useNavigate()

  const [music, setMusic] = useState<IMusic>()

  useEffect(() => {
    if (!permalink) {
      return
    }

    getMusicByPermalink(permalink)
      .then((res) => setMusic(res.data))
      .catch(() => navigate('/track/notfound'))
  }, [navigate, permalink])

  return !music ? (
    <Loading />
  ) : (
    <Wrapper>
      <TrackHead music={music} />
      <div>
        <CommentBox />
        <InteractionBar target={music} setTarget={setMusic} />
      </div>
      <Content>
        <div>{music.description}</div>
        {music.tags ? (
          <ul>
            {music.tags.map((tag, index) => (
              <li key={index}>{`#${tag}`}</li>
            ))}
          </ul>
        ) : (
          <></>
        )}
      </Content>
    </Wrapper>
  )
}

export default React.memo(TrackPage)
