import { getPlaylistByPermalink } from '@api/playlistApi'
import InteractionBar from '@components/InteractionBar/InteractionBar'
import Loading from '@components/Loading/Loading'
import RelatedTarget, {
  RelatedTargetHandler,
} from '@components/RelatedTarget/RelatedTarget'
import UserSmallCard from '@components/UserCard/UserSmallCard'
import { IPlaylist } from '@appTypes/types.type.'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import PlaylistHead from './PlaylistHead/PlaylistHead'
import * as PageStyle from '@styles/TargetPageStyle/TargetPage.style'
import PlaylistMusics from './PlaylistMusics/PlaylistMusics'
import { Helmet } from 'react-helmet'

const PlaylistPage = () => {
  const { userId, permalink } = useParams()
  const navigate = useNavigate()

  const [playlist, setPlaylist] = useState<IPlaylist | null>(null)
  const [existRelated, setExistRelated] = useState(false)
  const [minHeight, setMinHeight] = useState<string>()

  const relatedTargetRef = useRef<RelatedTargetHandler>(null)

  const getPlaylistDataFromServer = useCallback(async () => {
    if (!userId || !permalink) {
      navigate('/playlist/notfound')
      return
    }

    try {
      const response = await getPlaylistByPermalink(userId, permalink)
      setPlaylist(response.data)
    } catch (error: any) {
      console.error(error.response || error)
      navigate('playlist/notfound')
    }
  }, [navigate, permalink, userId])

  useEffect(() => {
    getPlaylistDataFromServer()
  }, [getPlaylistDataFromServer])

  useEffect(() => {
    if (
      playlist?.likesCount ||
      playlist?.repostsCount ||
      (playlist?.user && playlist.user.playlistsCount > 1)
    ) {
      setExistRelated(true)
    } else {
      setExistRelated(false)
    }
  }, [playlist])

  useEffect(() => {
    if (existRelated) {
      const height = relatedTargetRef.current?.getContentSize().height
      setMinHeight(height ? `${height + 40}px` : undefined)
    } else {
      setMinHeight(undefined)
    }
  }, [existRelated, playlist])

  return !playlist ? (
    <Loading />
  ) : (
    <>
      <Helmet>
        <title>{`${playlist.name} by ${
          playlist.user.nickname || playlist.user.username
        }  | Wave`}</title>
      </Helmet>
      <PageStyle.Wrapper>
        <PlaylistHead playlist={playlist} />
        <PageStyle.Container related={existRelated} minHeight={minHeight}>
          <InteractionBar
            className="interaction"
            target={playlist}
            setTarget={setPlaylist}
          />
          <PageStyle.StyledDivider />
          <PageStyle.Content media={existRelated ? 1000 : undefined}>
            <PageStyle.SubContent className="subcontent">
              <UserSmallCard
                className="content-uploader"
                user={playlist.user}
              />
              {existRelated ? (
                <PageStyle.SideContent className="sidecontent">
                  <RelatedTarget ref={relatedTargetRef} target={playlist} />
                </PageStyle.SideContent>
              ) : (
                <></>
              )}
            </PageStyle.SubContent>
            <PageStyle.MainContent className="maincontent">
              {playlist.description?.trim().length || playlist.tags?.length ? (
                <PageStyle.StyledDivider
                  className="media-divider"
                  sx={{ margin: '20px 0' }}
                />
              ) : (
                <></>
              )}
              <div className="content-info content-description">
                {playlist.description}
              </div>
              {playlist.tags ? (
                <ul className="content-info content-tags">
                  {playlist.tags.map((tag, index) => (
                    <li key={index} className="content-tags-item">
                      <Link to={`/search?tags=%23${tag}`}>{`#${tag}`}</Link>
                    </li>
                  ))}
                </ul>
              ) : (
                <></>
              )}
              <PlaylistMusics playlist={playlist} />
            </PageStyle.MainContent>
          </PageStyle.Content>
        </PageStyle.Container>
      </PageStyle.Wrapper>
    </>
  )
}

export default PlaylistPage
