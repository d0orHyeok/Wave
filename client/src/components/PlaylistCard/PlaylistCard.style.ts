import InteractionBar from '@components/InteractionBar/InteractionBar'
import { PrimaryButton } from '@components/Common/Button'
import styled from 'styled-components'

export const Container = styled.div`
  display: flex;
  padding: 10px 0;
`

export const ImageBox = styled.div`
  flex-shrink: 0;
  margin-right: 10px;

  & .link,
  & .img {
    width: 100%;
    height: 100%;
  }
`

export const PlaylistImageBox = styled(ImageBox)`
  width: 160px;
  height: 160px;

  ${({ theme }) => theme.device.tablet} {
    width: 120px;
    height: 120px;
  }
`

export const MusicImageBox = styled(ImageBox)`
  width: 20px;
  height: 20px;
`

export const PlaylistCardInfo = styled.div`
  width: 100%;
  min-width: 0;
  min-height: 160px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: space-between;

  & > * {
    width: 100%;
    min-width: 0;
  }

  ${({ theme }) => theme.device.tablet} {
    min-height: 120px;
  }

  & .playlist-info {
    & .playlist-info-user {
      display: flex;
      align-items: center;

      font-size: 13px;
      color: ${({ theme }) => theme.colors.bgTextRGBA(0.6)};

      & a:hover {
        color: ${({ theme }) => theme.colors.bgTextRGBA(0.86)};
      }

      & .playlistCard-uploader-repost {
        & .icon.repost {
          margin: 0 4px;
          transform: translateY(2px);
        }
      }
    }

    & .playlist-info-name {
      font-size: 16px;
      color: ${({ theme }) => theme.colors.bgText};
    }

    & .playlist-info-user,
    & .playlist-info-name,
    & .playlistCard-createdAt,
    & .playlistCard-uploader-repost {
      min-width: 0;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    &:after {
      content: '';
      display: block;
      clear: both;
    }

    & .playlistCard-createdAt {
      color: ${({ theme }) => theme.colors.bgTextRGBA(0.6)};
      margin-left: auto;
      padding-left: 4px;

      @media screen and (max-width: 600px) {
        display: none;
      }
    }
  }
`

export const PlayBtn = styled(PrimaryButton)`
  font-size: 20px;
  float: left;

  height: 40px;
  width: 40px;
  border-radius: 20px;
  margin-right: 10px;

  & .icon.play {
    transform: translate(2px, 1px);
  }
`

export const PlaylistMusicUl = styled.ul`
  margin-top: 10px;
  border: 1px solid ${({ theme }) => theme.colors.border1};

  & .playlist-musicItem {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    height: 30px;
    padding: 0 5px;

    &:not(:last-child) {
      border-bottom: 1px solid ${({ theme }) => theme.colors.border1};
    }

    & .musicItem-info {
      font-size: 13px;
      color: ${({ theme }) => theme.colors.bgTextRGBA(0.86)};

      &.musicItem-index {
        flex-shrink: 0;
        margin-right: 5px;
      }

      &.musicItem-uploader {
        flex-shrink: 0;
        color: ${({ theme }) => theme.colors.bgTextRGBA(0.6)};
        &:hover {
          color: inherit;
        }

        ${({ theme }) => theme.device.mobile} {
          display: none;
        }

        &::after {
          content: '-';
          color: ${({ theme }) => theme.colors.bgTextRGBA(0.86)};
          margin: 0 4px;
        }
      }

      &.musicItem-title {
        min-width: 0;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        margin-right: auto;
      }

      &.musicItem-play {
        margin-left: 4px;
        flex-shrink: 0;

        & .icon.play {
          font-size: 10px;
          margin-right: 3px;
        }

        @media screen and (max-width: 600px) {
          display: none;
        }
      }
    }
  }

  & .viewMore {
    border: none;
    width: 100%;
    padding: 5px 0;
    font-size: 13px;
    text-align: center;
    cursor: pointer;
    color: ${({ theme }) => theme.colors.bgTextRGBA(0.6)};

    &:hover {
      color: ${({ theme }) => theme.colors.bgText};
    }
  }
`

export const StyledInteractionBar = styled(InteractionBar)`
  margin-top: 10px;
`
