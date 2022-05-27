import { useAppSelector } from '@redux/hook'
import React, { useRef } from 'react'
import { EmptyProfileImage } from '@styles/EmptyImage'
import styled from 'styled-components'

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

const ImageBox = styled.div`
  width: 40px;
  height: 40px;
  & .img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: inherit;
  }
`

type CommentBoxProps = React.HTMLAttributes<HTMLDivElement>

const CommentBox = (props: CommentBoxProps) => {
  const user = useAppSelector((state) => state.user)

  const commentRef = useRef<HTMLInputElement>(null)

  return (
    <Box {...props}>
      <ImageBox>
        {user.userData?.profileImage ? (
          <img className="img" src={user.userData?.profileImage} alt="" />
        ) : (
          <EmptyProfileImage className="img" />
        )}
      </ImageBox>
      <div className="textBox">
        <input ref={commentRef} type="text" placeholder="Write a comment" />
      </div>
    </Box>
  )
}

export default CommentBox
