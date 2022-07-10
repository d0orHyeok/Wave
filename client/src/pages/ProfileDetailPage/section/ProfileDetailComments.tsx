import calculateDateAgo from '@api/functions/calculateDateAgo'
import { IComment } from '@appTypes/comment.type'
import LoadingArea from '@components/Loading/LoadingArea'
import React, { useCallback, useLayoutEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'

const CommentBox = styled.div`
  padding: 10px 0;
  color: ${({ theme }) => theme.colors.bgText};
  font-size: 13px;

  &:not(:last-child) {
    border-bottom: 1px solid ${({ theme }) => theme.colors.border1};
  }

  & .head {
    display: flex;
    align-items: center;

    & .music,
    & .createdAt {
      min-width: 0;
      text-overflow: ellipsis;
      overflow: hidden;
      white-space: nowrap;
    }

    & .music {
      &::before {
        content: 'on';
        margin-right: 4px;
        color: ${({ theme }) => theme.colors.bgText};
      }

      color: ${({ theme }) => theme.colors.bgTextRGBA(0.6)};

      &:hover {
        color: ${({ theme }) => theme.colors.bgText};
      }
    }

    & .createdAt {
      margin-left: auto;
      color: ${({ theme }) => theme.colors.bgTextRGBA(0.6)};
    }
  }
`

interface IProfileDetailCommentsProps
  extends React.HTMLAttributes<HTMLDivElement> {
  comments: IComment[]
}

const ProfileDetailComments = ({
  comments,
  ...props
}: IProfileDetailCommentsProps) => {
  const [displayComments, setDisplayComments] = useState<IComment[]>([])
  const [page, setPage] = useState(0)
  const [done, setDone] = useState(false)
  const [loading, setLoading] = useState(false)

  const getRelatedMusics = useCallback(async () => {
    if (done) {
      return
    }

    setLoading(true)
    try {
      const skip = page * 15
      const getItems = comments.slice(skip, skip + 15)
      if (!getItems || getItems.length < 15) {
        setDone(true)
      }
      setDisplayComments((prevState) => [...prevState, ...getItems])
    } catch (error: any) {
      console.error(error.response || error)
      setDone(true)
    } finally {
      setLoading(false)
    }
  }, [done, page, comments])

  const handleOnView = useCallback(
    (inView: boolean) => {
      if (inView && !loading && !done) {
        setPage((prevState) => prevState + 1)
      }
    },
    [loading, done]
  )

  useLayoutEffect(() => {
    getRelatedMusics()
  }, [getRelatedMusics])

  return (
    <div {...props}>
      {displayComments.map((comment, index) => (
        <CommentBox key={index}>
          <div className="head">
            <div className="music">
              <Link
                to={`/track/${comment.music.userId}/${comment.music.permalink}`}
              >
                {comment.music.title}
              </Link>
            </div>
            <div className="createdAt">
              {calculateDateAgo(comment.createdAt)}
            </div>
          </div>
          <div className="text">{`"${comment.text}"`}</div>
        </CommentBox>
      ))}
      <LoadingArea loading={loading} hide={done} onInView={handleOnView} />
    </div>
  )
}

export default ProfileDetailComments
