import { IMusic } from '@redux/features/player/palyerSlice.interface'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import TrackHead from './TrackHead/TrackHead'
import * as PageStyle from '@styles/TargetPageStyle/TargetPage.style'
import Loading from '@components/Loading/Loading'
import CommentBox from '@components/CommentBox/CommentBox'
import InteractionBar from '@components/InteractionBar/InteractionBar'
import { getMusicByPermalink, findRelatedMusics } from '@api/musicApi'
import RelatedTarget, {
  RelatedTargetHandler,
} from '../../components/RelatedTarget/RelatedTarget'
import UserSmallCard from '@components/UserCard/UserSmallCard'
import TrackComments from './TrackComments/TrackComments'
import useInterval from '@api/Hooks/userInterval'

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
      setExistRelated(false)
    }
  }, [music, relatedMusics])

  useEffect(() => {
    if (existRelated) {
      const height = relatedTargetRef.current?.getContentSize().height
      setMinHeight(height ? `${height + 40}px` : undefined)
    } else {
      setMinHeight(undefined)
    }
  }, [existRelated, music, relatedMusics])

  return !music ? (
    <Loading />
  ) : (
    <PageStyle.Wrapper>
      <TrackHead music={music} />
      <PageStyle.Container related={existRelated} minHeight={minHeight}>
        <CommentBox className="comment" music={music} setMusic={setMusic} />
        <InteractionBar
          className="interaction"
          target={music}
          setTarget={setMusic}
          visibleOption={['plays', 'likes', 'reposts']}
        />
        <PageStyle.StyledDivider />
        <PageStyle.Content media={existRelated ? 1000 : undefined}>
          <PageStyle.SubContent className="subcontent">
            <UserSmallCard className="content-uploader" user={music.user} />
            {existRelated ? (
              <PageStyle.SideContent className="sidecontent">
                <RelatedTarget
                  ref={relatedTargetRef}
                  target={music}
                  relatedMusics={relatedMusics}
                />
              </PageStyle.SideContent>
            ) : (
              <></>
            )}
          </PageStyle.SubContent>
          <PageStyle.MainContent className="maincontent">
            {music.description?.trim().length || music.tags?.length ? (
              <PageStyle.StyledDivider
                className="media-divider"
                sx={{ margin: '20px 0' }}
              />
            ) : (
              <></>
            )}
            <div className="content-info content-description">
              {music.description}
            </div>
            {music.tags ? (
              <ul className="content-info content-tags">
                {music.tags.map((tag, index) => (
                  <li key={index} className="content-tags-item">
                    <Link to={`/search?tags=%23${tag}`}>{`#${tag}`}</Link>
                  </li>
                ))}
              </ul>
            ) : (
              <></>
            )}

            <TrackComments music={music} setMusic={setMusic} />
          </PageStyle.MainContent>
        </PageStyle.Content>
      </PageStyle.Container>
    </PageStyle.Wrapper>
  )
}

export default React.memo(TrackPage)
