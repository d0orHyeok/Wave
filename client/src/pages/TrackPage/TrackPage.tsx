import { IMusic } from '@redux/features/player/palyerSlice.interface'
import React, { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import TrackHead from './TrackHead/TrackHead'
import styled from 'styled-components'
import Loading from '@components/Loading/Loading'
import CommentBox from '@components/CommentBox/CommentBox'
import InteractionBar from '@components/InteractionBar/InteractionBar'
import { getMusicByPermalink, findRelatedMusics } from '@api/musicApi'
import { Divider } from '@mui/material'
import RelatedTrack from './RelatedTrack/RelatedTrack'
import UserSmallCard from '@components/UserCard/UserSmallCard'
import { FaComment } from 'react-icons/fa'
import { EmptyProfileImage } from '@styles/EmptyImage'
import calculateDateAgo from '@api/functions/calculateDateAgo'

const Wrapper = styled.div`
  min-height: 100%;
  max-width: 1200px;
  width: 100%;
  margin: auto;
  font-size: 14px;
  line-height: 14px;
`

const Container = styled.div`
  position: relative;
  padding: 20px;
  padding-right: 320px;

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

const Content = styled.div`
  padding-top: 15px;
  display: flex;

  & .media-divider {
    display: none;
  }

  @media screen and (max-width: 1000px) {
    flex-direction: column;
    & .subcontent {
      margin: 0 auto;
    }
    & .media-divider {
      display: block;
    }
    & .musiccontent {
      margin-left: 0;
    }
  }

  ${({ theme }) => theme.device.tablet} {
    & .subcontent {
      margin: 0;
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
  width: 100%;
  margin-left: 20px;
  color: ${({ theme }) => theme.colors.bgTextRGBA(0.6)};

  & .music-info {
    &:not(:last-child) {
      margin-bottom: 20px;
    }
  }

  & .music-tags {
    min-width: 0;
    width: 100%;
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

const MusicComments = styled.div`
  padding: 10px 0;

  & .comment-item {
    display: flex;

    &:not(:last-child) {
      margin-bottom: 15px;
    }

    & .comment-imageBox {
      flex-shrink: 0;
      width: 40px;
      height: 40px;
      margin-right: 10px;
      & .comment-imageBox-image,
      & .comment-imageBox-link {
        width: 100%;
        height: 100%;
        border-radius: 20px;
        object-fit: cover;
      }
    }

    & .comment-content {
      min-width: 0;
      & .comment-content-username {
        margin-bottom: 3px;
        min-width: 0;
        width: 100%;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      & .comment-content-text {
      }

      & .comment-content-username:hover,
      & .comment-content-text {
        color: ${({ theme }) => theme.colors.bgTextRGBA(0.86)};
      }
    }

    & .comment-createdAt {
      margin-left: auto;
      font-size: 12px;
    }
  }
`

const TrackPage = () => {
  const { '*': permalink } = useParams()
  const navigate = useNavigate()

  const [music, setMusic] = useState<IMusic>()
  const [relatedMusics, setRelatedMusics] = useState<IMusic[]>([])

  useEffect(() => {
    if (!permalink) {
      return
    }

    getMusicByPermalink(permalink)
      .then((res) => setMusic(res.data))
      .catch(() => navigate('/track/notfound'))
  }, [navigate, permalink])

  useEffect(() => {
    if (music?.id) {
      findRelatedMusics(music.id)
        .then((res) => setRelatedMusics(res.data))
        .catch((err) => console.error(err))
    }
  }, [music?.id])

  return !music ? (
    <Loading />
  ) : (
    <Wrapper>
      <TrackHead music={music} />
      <Container>
        <CommentBox className="comment" />
        <InteractionBar
          className="interaction"
          target={music}
          setTarget={setMusic}
        />
        <StyledDivider />
        <Content>
          <SubContent className="subcontent">
            <UserSmallCard className="music-uploader" user={music.user} />
            <SideContent>
              <RelatedTrack music={music} relatedMusics={relatedMusics} />
            </SideContent>
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

            {false ? (
              <>
                <h2 className="subtitle-comment">
                  <FaComment className="icon comment" />
                  {`${2} comments`}
                </h2>
                <StyledDivider />
                <MusicComments>
                  {Array.from({ length: 3 }, (v, n) => n).map((v) => (
                    <div key={v} className="comment-item">
                      <div className="comment-imageBox">
                        <Link
                          className="comment-imageBox-link"
                          to={`/profile/${v}`}
                        >
                          {v === 10 ? (
                            <img
                              className="comment-imageBox-image"
                              src="d"
                              alt=""
                            />
                          ) : (
                            <EmptyProfileImage className="comment-imageBox-image" />
                          )}
                        </Link>
                      </div>
                      <div className="comment-content">
                        <div className="comment-content-username">
                          <Link to={`/profile/${1}`}>{'samepleuser'}</Link>
                        </div>
                        <div className="comment-content-text">
                          {'sample text'}
                        </div>
                      </div>
                      <div className="comment-createdAt">
                        {calculateDateAgo(100)}
                      </div>
                    </div>
                  ))}
                </MusicComments>
              </>
            ) : (
              <></>
            )}
          </MusicContent>
        </Content>
      </Container>
    </Wrapper>
  )
}

export default React.memo(TrackPage)
