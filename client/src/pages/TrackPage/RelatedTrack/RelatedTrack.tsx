import { Divider } from '@mui/material'
import { IMusic } from '@redux/features/player/palyerSlice.interface'
import {
  EmptyMusicCover,
  EmptyPlaylistImage,
  EmptyProfileImage,
} from '@styles/EmptyImage'
import React from 'react'
import { BiRepost } from 'react-icons/bi'
import { GoHeart } from 'react-icons/go'
import { RiCheckboxMultipleBlankFill } from 'react-icons/ri'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import PopoverUser from '@components/PopoverUser/PopoverUser'
import InteractionCount from '@components/InteractionBar/InteractionCount'
import { BsSoundwave } from 'react-icons/bs'

const Container = styled.div`
  color: ${({ theme }) => theme.colors.bgTextRGBA(0.6)};
  font-size: 14px;
  line-height: 14px;
`

const StyledDivider = styled(Divider)`
  background-color: ${({ theme }) => theme.colors.border1};
`

const BoxTitle = styled.h2`
  padding: 10px 0;
  display: flex;
  align-items: center;

  & .icon {
    margin-right: 5px;
    &.repost,
    &.soundwave {
      font-size: 16px;
    }
  }

  & .text {
    margin-right: auto;
  }

  & .view {
    &:hover {
      color: ${({ theme }) => theme.colors.bgTextRGBA(0.86)};
    }
  }
`

const ItemBox = styled.div`
  padding: 10px 0;
`

const Item = styled.div`
  display: flex;

  &:not(:last-child) {
    margin-bottom: 10px;
  }

  & .imgBox {
    margin-right: 10px;
    flex-shrink: 0;
    width: 50px;
    height: 50px;
    & .link,
    & .img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  & .info {
    min-width: 0;
    & .user,
    & .name {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    & .user {
      position: relative;
      margin-bottom: 5px;
    }

    & .name {
      color: ${({ theme }) => theme.colors.bgTextRGBA(0.86)};
    }
  }
`

const UserBox = styled(ItemBox)`
  display: flex;
`

const UserItem = styled.div`
  position: relative;

  &:not(:last-child) {
    margin-right: -10px;
  }

  & .imgBox {
    width: 40px;
    height: 40px;
    border-radius: 20px;
    border: 2px solid ${({ theme }) => theme.colors.bgColor};
    & .link,
    & .img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      border-radius: inherit;
    }
  }
`

interface RelatedTrackProps extends React.HTMLAttributes<HTMLDivElement> {
  music: IMusic
  relatedMusics: IMusic[]
}

const RelatedTrack = ({
  music,
  relatedMusics,
  ...props
}: RelatedTrackProps) => {
  return (
    <>
      <Container {...props}>
        {relatedMusics.length ? (
          <>
            <BoxTitle>
              <BsSoundwave className="icon soundwave" />
              <div className="text">Related Tracks</div>

              <div className="view">
                <Link
                  to={`/trackDetail/${music.userId}/${music.permalink}/related-tracks`}
                >
                  View all
                </Link>
              </div>
            </BoxTitle>
            <StyledDivider />
            <ItemBox>
              {relatedMusics.slice(0, 3).map((music, index) => (
                <Item key={index}>
                  <div className="imgBox">
                    <Link
                      className="link"
                      to={`/track/${music.userId}/${music.permalink}`}
                    >
                      {music.cover ? (
                        <img className="img" src={music.cover} alt="" />
                      ) : (
                        <EmptyMusicCover className="img" />
                      )}
                    </Link>
                  </div>
                  <div className="info">
                    <div className="user">
                      <Link to={`/profile/${music.userId}`}>
                        {music.user?.nickname || music.userId}
                      </Link>
                    </div>
                    <div className="name">
                      <Link to={`/music/${music.userId}/${music.permalink}`}>
                        {music.title}
                      </Link>
                    </div>
                    <InteractionCount target={music} />
                  </div>
                </Item>
              ))}
            </ItemBox>
          </>
        ) : (
          <></>
        )}

        {/* In Playlist */}
        {music.playlists && music.playlists.length ? (
          <>
            <BoxTitle>
              <RiCheckboxMultipleBlankFill className="icon" />
              <div className="text">In Playlist</div>

              <div className="view">
                <Link
                  to={`/trackDetail/${music.userId}/${music.permalink}/playlists`}
                >
                  View all
                </Link>
              </div>
            </BoxTitle>
            <StyledDivider />
            <ItemBox>
              {music.playlists.slice(0, 3).map((playlist, index) => (
                <Item key={index}>
                  <Link
                    to={`/playlist/${playlist.userId}/${playlist.permalink}`}
                  >
                    <div className="imgBox">
                      {playlist.image ? (
                        <img className="img" src={playlist.image} alt="" />
                      ) : (
                        <EmptyPlaylistImage className="img" />
                      )}
                    </div>
                  </Link>
                  <div className="info">
                    <div className="user">
                      <Link to={`/profile/${playlist.userId}`}>
                        {playlist.user.nickname}
                      </Link>
                    </div>
                    <div className="name">
                      <Link
                        to={`/playlist/${playlist.userId}/${playlist.permalink}`}
                      >
                        {playlist.name}
                      </Link>
                    </div>
                    <InteractionCount target={playlist} />
                  </div>
                </Item>
              ))}
            </ItemBox>
          </>
        ) : (
          <></>
        )}

        {/* likes */}
        {music.likesCount ? (
          <>
            <BoxTitle>
              <GoHeart className="icon" />
              <div className="text">Likes</div>
              <div className="view">
                <Link
                  to={`/trackDetail/${music.userId}/${music.permalink}/likes`}
                >
                  View all
                </Link>
              </div>
            </BoxTitle>
            <StyledDivider />
            <UserBox>
              {music.likes.slice(0, 8).map((user, index) => (
                <UserItem key={index}>
                  <div className="imgBox">
                    <Link className="link" to={`/profile/${user.id}`}>
                      {user.profileImage ? (
                        <img className="img" src={user.profileImage} alt="" />
                      ) : (
                        <EmptyProfileImage className="img" />
                      )}
                    </Link>
                  </div>

                  {/* popover content */}
                  <PopoverUser user={user} />
                </UserItem>
              ))}
            </UserBox>
          </>
        ) : (
          <></>
        )}

        {/* reposts */}
        {music.reposts && music.reposts.length ? (
          <>
            <BoxTitle>
              <BiRepost className="icon repost" />
              <div className="text">Reposts</div>
              <div className="view">
                <Link
                  to={`/trackDetail/${music.userId}/${music.permalink}/reposts`}
                >
                  View all
                </Link>
              </div>
            </BoxTitle>
            <StyledDivider />
            <UserBox>
              {music.reposts.slice(0, 8).map((user, index) => (
                <UserItem key={index}>
                  <div className="imgBox">
                    <Link className="link" to={`/profile/${user.id}`}>
                      {user.profileImage ? (
                        <img className="img" src={user.profileImage} alt="" />
                      ) : (
                        <EmptyProfileImage className="img" />
                      )}
                    </Link>
                  </div>

                  {/* popover content */}
                  <PopoverUser user={user} />
                </UserItem>
              ))}
            </UserBox>
          </>
        ) : (
          <></>
        )}
      </Container>
    </>
  )
}

export default RelatedTrack
