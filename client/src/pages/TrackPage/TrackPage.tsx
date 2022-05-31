import { IMusic } from '@redux/features/player/palyerSlice.interface'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import TrackHead from './TrackHead/TrackHead'
import styled from 'styled-components'
import Loading from '@components/Loading/Loading'
import CommentBox from '@components/CommentBox/CommentBox'
import InteractionBar from '@components/InteractionBar/InteractionBar'
import { getMusicByPermalink, findRelatedMusics } from '@api/musicApi'
import { Divider } from '@mui/material'
import RelatedTarget, {
  RelatedTargetHandler,
} from '../../components/RelatedTarget/RelatedTarget'
import UserSmallCard from '@components/UserCard/UserSmallCard'
import TrackComments from './TrackComments/TrackComments'
import useInterval from '@api/Hooks/userInterval'

const Wrapper = styled.div`
  min-height: 100%;
  max-width: 1200px;
  width: 100%;
  margin: 0 auto;
  font-size: 14px;
  line-height: 14px;
`

interface ContainerProps {
  related?: boolean
  minHeight?: string
}

const Container = styled.div<ContainerProps>`
  position: relative;
  padding: 20px;
  padding-right: ${({ related }) => (related ? '320px' : '20px')};
  height: 100%;
  ${({ minHeight }) => minHeight && `min-height: ${minHeight};`}

  & .interaction {
    margin: 15px 0 10px 0;
  }

  ${({ theme }) => theme.device.tablet} {
    position: static;
    padding-right: 20px;
  }
`

const SideContent = styled.div`
  flex-shrink: 0;
  width: 300px;
  padding: 0 20px;
  border-left: 1px solid ${({ theme }) => theme.colors.border1};

  position: absolute;
  top: 20px;
  right: 0;
  height: calc(100% - 40px);

  ${({ theme }) => theme.device.tablet} {
    position: static;
    margin-left: 20px;
    flex-grow: 1;
    padding-right: 0;
    width: auto;
    height: auto;
  }

  @media screen and (max-width: 600px) {
    border-left: none;
    padding: 0;
    margin: 0;
    margin-top: 20px;
  }
`

const StyledDivider = styled(Divider)`
  background-color: ${({ theme }) => theme.colors.border1};
`

const Content = styled.div<{ media?: number }>`
  padding-top: 15px;
  display: flex;
  align-items: flex-start;
  width: 100%;

  & .media-divider {
    display: none;
  }

  @media screen and (max-width: ${({ media }) => (media ? media : '800')}px) {
    flex-direction: column;
    & .subcontent {
      width: 100%;
      justify-content: center;
    }
    & .media-divider {
      display: block;
    }
    & .musiccontent {
      margin-left: 0;
    }
  }
`

const SubContent = styled.div`
  display: flex;

  @media screen and (max-width: 600px) {
    display: block;
    position: relative;

    & .music-uploader {
      position: relative;
      left: 50%;
      transform: translateX(-50%);
    }
  }
`

const MusicContent = styled.div`
  min-width: 0;
  width: 100%;
  margin-left: 20px;
  color: ${({ theme }) => theme.colors.bgTextRGBA(0.6)};

  & .music-info {
    &:not(:last-child) {
      margin-bottom: 20px;
    }

    &.music-description {
      white-space: normal;
      word-wrap: break-word;
    }
  }

  & .music-tags {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    font-size: 13px;

    & .music-tags-item {
      flex-shrink: 0;
      color: white;
      background-color: gray;
      padding: 0 5px;
      height: 20px;
      line-height: 20px;
      border-radius: 10px;
      margin-bottom: 6px;

      &:hover {
        background-color: #616161;
      }

      &:not(:last-child) {
        margin-right: 10px;
      }
    }
  }

  & .subtitle-comment {
    margin-bottom: 10px;
    & .icon.comment {
      margin-right: 5px;
    }
  }
`

const TrackPage = () => {
  const { userId, permalink } = useParams()
  const navigate = useNavigate()

  const [music, setMusic] = useState<IMusic>()
  const [relatedMusics, setRelatedMusics] = useState<IMusic[]>([])
  const [existRelated, setExistRelated] = useState(false)
  const [minHeight, setMinHeight] = useState<string>()

  const relatedTargetRef = useRef<RelatedTargetHandler>(null)

  const reloadMusicData = useCallback(() => {
    if (!permalink || !userId) {
      return navigate('/track/notfound')
    }

    getMusicByPermalink(userId, permalink)
      .then((res) => setMusic(res.data))
      .catch((error) => console.error(error.response || error))

    if (!music?.id) {
      return
    }

    findRelatedMusics(music?.id)
      .then((res) => setRelatedMusics(res.data))
      .catch((err) => console.error(err.response))
  }, [music?.id, navigate, permalink, userId])

  // 10분에 한번씩 음악정보를 다시 가져온다
  useInterval(reloadMusicData, 1000 * 60 * 10)

  useEffect(() => {
    if (!userId || !permalink) {
      navigate('/track/notfound')
      return
    }

    getMusicByPermalink(userId, permalink)
      .then((res) => setMusic(res.data))
      .catch(() => navigate('/track/notfound'))
  }, [navigate, permalink, userId])

  useEffect(() => {
    if (music?.id) {
      findRelatedMusics(music.id)
        .then((res) => setRelatedMusics(res.data))
        .catch((err) => console.error(err.response))
    }
  }, [music?.id])

  useEffect(() => {
    if (
      relatedMusics.length ||
      music?.playlistsCount ||
      music?.likesCount ||
      music?.repostsCount
    ) {
      setExistRelated(true)
    } else {
      false
    }
  }, [music, relatedMusics])

  useEffect(() => {
    if (existRelated) {
      const height = relatedTargetRef.current?.getContentSize().height
      console.log(height)
      setMinHeight(height ? `${height + 40}px` : undefined)
    } else {
      setMinHeight(undefined)
    }
  }, [existRelated, music, relatedMusics])

  return !music ? (
    <Loading />
  ) : (
    <Wrapper>
      <TrackHead music={music} />
      <Container related={existRelated} minHeight={minHeight}>
        <CommentBox className="comment" music={music} setMusic={setMusic} />
        <InteractionBar
          className="interaction"
          target={music}
          setTarget={setMusic}
          visibleOption={['plays', 'likes', 'reposts']}
        />
        <StyledDivider />
        <Content media={existRelated ? 1000 : undefined}>
          <SubContent className="subcontent">
            <UserSmallCard className="music-uploader" user={music.user} />
            {existRelated ? (
              <SideContent className="sidecontent">
                <RelatedTarget
                  ref={relatedTargetRef}
                  target={music}
                  relatedMusics={relatedMusics}
                />
              </SideContent>
            ) : (
              <></>
            )}
          </SubContent>
          <MusicContent className="musiccontent">
            {music.description?.trim().length || music.tags?.length ? (
              <StyledDivider
                className="media-divider"
                sx={{ margin: '20px 0' }}
              />
            ) : (
              <></>
            )}
            <div className="music-info music-description">
              {music.description}
            </div>
            {music.tags ? (
              <ul className="music-info music-tags">
                {music.tags.map((tag, index) => (
                  <li key={index} className="music-tags-item">
                    <Link to={`/search?tags=%23${tag}`}>{`#${tag}`}</Link>
                  </li>
                ))}
              </ul>
            ) : (
              <></>
            )}

            <TrackComments music={music} setMusic={setMusic} />
          </MusicContent>
        </Content>
      </Container>
    </Wrapper>
  )
}

export default React.memo(TrackPage)
