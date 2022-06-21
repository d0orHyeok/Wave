import { useAppSelector } from '@redux/hook'
import React, { useCallback, useRef } from 'react'
import { EmptyProfileImage } from '@styles/EmptyImage'
import styled from 'styled-components'
import { IMusic, IComment } from '@appTypes/types.type.'
import { createComment } from '@api/commentApi'

const Box = styled.div`
  height: 40px;
  display: flex;
  align-items: center;
  background-color: ${({ theme }) => theme.colors.bgColor};

  & .textBox {
    border: 1px solid ${({ theme }) => theme.colors.border1};
    background-color: ${({ theme }) => theme.colors.bgColorRGBA(0.16)};
    height: 100%;
    width: 100%;
    padding: 5px;

    & input {
      border: 1px solid ${({ theme }) => theme.colors.border1};
      background-color: ${({ theme }) => theme.colors.bgColor};
      color: ${({ theme }) => theme.colors.bgText};
      width: 100%;
      height: 100%;
      padding: 0 10px;
      &:focus {
        outline: none;
      }
    }
  }
`

const ImgBox = styled.div`
  width: 40px;
  height: 40px;
  & .img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 0;
  }
`

interface CommentBoxProps extends React.HTMLAttributes<HTMLDivElement> {
  music: IMusic
  setMusic: React.Dispatch<React.SetStateAction<IMusic | undefined>>
}

const CommentBox = ({ music, setMusic, ...props }: CommentBoxProps) => {
  const user = useAppSelector((state) => state.user)
  const commentedAt = useAppSelector(
    (state) => state.player.progress.currentTime
  )

  const commentRef = useRef<HTMLInputElement>(null)

  const handleSubminComment = useCallback(
    (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (!user.isLogin || !commentRef.current) {
        return
      }

      if (event.key !== 'Enter') {
        return
      }

      const text = commentRef.current.value.trim()

      if (!text.length) {
        commentRef.current.focus()
        return alert('Please type comment at least 1 character')
      }

      const body = {
        text,
        musicId: music?.id,
        commentedAt: commentedAt,
      }
      createComment(body)
        .then((res) => {
          const createdComment: IComment = res.data
          const existComments = music.comments || []
          const newComments = [createdComment, ...existComments]
          setMusic({
            ...music,
            comments: newComments,
            commentsCount: newComments.length,
          })
          if (commentRef.current) commentRef.current.value = ''
          return
        })
        .catch((error) => {
          console.error(error.response || error)
          return alert('Failed to add comment')
        })
    },
    [commentedAt, music, setMusic, user.isLogin]
  )

  return (
    <Box {...props}>
      <ImgBox>
        {user.userData?.profileImage ? (
          <img className="img" src={user.userData?.profileImage} alt="" />
        ) : (
          <EmptyProfileImage className="img" />
        )}
      </ImgBox>
      <div className="textBox">
        <input
          ref={commentRef}
          onKeyPress={handleSubminComment}
          type="text"
          placeholder="Write a comment"
        />
      </div>
    </Box>
  )
}

export default CommentBox
