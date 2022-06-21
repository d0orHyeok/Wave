import { IMusic } from '@appTypes/types.type.'
import styled from 'styled-components'
import React, { useCallback } from 'react'
import { Divider } from '@mui/material'
import { FaComment } from 'react-icons/fa'
import { Link } from 'react-router-dom'
import { EmptyProfileImage } from '@styles/EmptyImage'
import calculateDateAgo from '@api/functions/calculateDateAgo'
import { useAppDispatch, useAppSelector } from '@redux/hook'
import { Button } from '@components/Common'
import { RiDeleteBin5Fill } from 'react-icons/ri'
import { deleteComment } from '@api/commentApi'
import { convertTimeToString } from '@api/functions'
import {
  setCurrentMusic,
  setProgress,
  togglePlay,
} from '@redux/features/player/playerSlice'
import PopoverUser from '@components/PopoverUser/PopoverUser'

const StyledDivider = styled(Divider)`
  background-color: ${({ theme }) => theme.colors.border1};
`

const CommentHead = styled.div`
  margin-bottom: 10px;
  & .icon.comment {
    margin-right: 5px;
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

        & .commentedAt {
          border: none;

          &:hover {
            color: ${({ theme }) => theme.colors.bgTextRGBA(0.86)};
          }

          &::before {
            cursor: default;
            color: ${({ theme }) => theme.colors.bgTextRGBA(0.5)};
            font-size: 0.8em;
            content: 'at';
            margin-right: 5px;
          }
        }
      }

      & .comment-content-text {
        overflow-wrap: break-word;
      }

      & .comment-content-username .comment-link:hover,
      & .comment-content-text {
        color: ${({ theme }) => theme.colors.bgTextRGBA(0.86)};
      }
    }

    & .comment-createdAt {
      margin-left: auto;
      font-size: 12px;
      text-align: right;
    }

    & .deleteBtn {
      display: none;
    }

    &:hover {
      & .deleteBtn {
        display: inline-block;
      }
    }
  }
`

const DeleteButton = styled(Button)`
  margin: 0 5px;
  margin-top: 2px;
  font-size: 14px;
  color: ${({ theme }) => theme.colors.bgText};
  padding: 0 5px;
  border: 1px solid ${({ theme }) => theme.colors.border2};
  border-radius: 3px;

  &:hover {
    border-color: ${({ theme }) => theme.colors.bgText};
  }
`

const EmptyComment = styled.div`
  padding: 10px 0;
  text-align: center;
  font-size: 10px;

  & .icon.comment {
    font-size: 15em;
    color: ${({ theme }) => theme.colors.bgTextRGBA(0.15)};
  }

  & .text-main {
    font-size: 2em;
    color: ${({ theme }) => theme.colors.bgText};
    margin: 1em 0;
  }

  & .text-light {
    font-size: 1.6em;
    color: ${({ theme }) => theme.colors.bgTextRGBA(0.6)};
  }

  ${({ theme }) => theme.device.tablet} {
    font-size: 8px;
  }
`

interface TrackCommentsProps {
  music: IMusic
  setMusic: React.Dispatch<React.SetStateAction<IMusic | undefined>>
}

const TrackComments = ({ music, setMusic }: TrackCommentsProps) => {
  const dispatch = useAppDispatch()

  const userId = useAppSelector((state) => state.user.userData?.id)
  const duration = useAppSelector((state) => state.player.progress.duration)
  const currentMusic = useAppSelector((state) => state.player.currentMusic)

  const handleClickCommentedAt = useCallback(
    (commentedAt: number) => async (event: React.MouseEvent<HTMLElement>) => {
      event.preventDefault()
      event.stopPropagation()

      const percent = (commentedAt / duration) * 100

      if (currentMusic?.id !== music.id) {
        dispatch(setCurrentMusic(music))
      }

      dispatch(
        setProgress({
          currentTime: commentedAt,
          currentStringTime: convertTimeToString(commentedAt),
          percent,
        })
      )
      dispatch(togglePlay(true))

      const musicPlayer = document
        .getElementsByTagName('audio')
        .namedItem('wave-music-player')
      if (musicPlayer) {
        musicPlayer.currentTime = commentedAt
      }
    },
    [currentMusic?.id, dispatch, duration, music]
  )

  const handleClickDeleteButton = useCallback(
    (commentId: number) => (event: React.MouseEvent<HTMLButtonElement>) => {
      event.preventDefault()
      event.stopPropagation()
      deleteComment(commentId)
        .then(() => {
          const existComments = music.comments || []
          const newComments = existComments.filter(
            (comment) => comment.id !== commentId
          )
          setMusic({
            ...music,
            comments: newComments,
            commentsCount: newComments.length,
          })
        })
        .catch((error) => {
          console.error(error.response || error)
          return alert('Failed to delete comment')
        })
    },
    [music, setMusic]
  )

  return music.commentsCount > 0 ? (
    <>
      <CommentHead>
        <FaComment className="icon comment" />
        {`${music.commentsCount} comments`}
      </CommentHead>
      <StyledDivider />
      <MusicComments>
        {music.comments.map((comment, index) => (
          <div key={index} className="comment-item">
            <div className="comment-imageBox">
              <Link
                className="comment-imageBox-link"
                to={`/profile/${comment.userId}`}
              >
                {comment.user.profileImage ? (
                  <img
                    className="comment-imageBox-image"
                    src={comment.user.profileImage}
                    alt=""
                  />
                ) : (
                  <EmptyProfileImage className="comment-imageBox-image" />
                )}
              </Link>
              <PopoverUser user={comment.user} />
            </div>
            <div className="comment-content">
              <div className="comment-content-username">
                <Link
                  className="comment-link"
                  to={`/profile/${comment.userId}`}
                >
                  {comment.user.nickname || comment.user.username}
                </Link>
                <button
                  className="commentedAt"
                  onClick={handleClickCommentedAt(comment.commentedAt)}
                >
                  {convertTimeToString(comment.commentedAt)}
                </button>
              </div>
              <div className="comment-content-text">{comment.text}</div>
            </div>
            {comment.userId !== userId ? (
              <div className="comment-createdAt">
                {calculateDateAgo(comment.updatedAt || comment.createdAt)}
              </div>
            ) : (
              <div className="comment-createdAt">
                <div>
                  {calculateDateAgo(comment.updatedAt || comment.createdAt)}
                </div>
                <DeleteButton
                  title="delete"
                  className="deleteBtn"
                  onClick={handleClickDeleteButton(comment.id)}
                >
                  <RiDeleteBin5Fill />
                </DeleteButton>
              </div>
            )}
          </div>
        ))}
      </MusicComments>
    </>
  ) : (
    <EmptyComment>
      <FaComment className="icon comment" />
      <div className="text-main">Seems a little quiet over here</div>
      <div className="text-light">Be the first to comment on this track</div>
    </EmptyComment>
  )
}

export default TrackComments
