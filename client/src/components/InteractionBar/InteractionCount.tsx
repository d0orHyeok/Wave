import { numberFormat } from '@api/functions'
import { IMusic, IPlaylist } from '@appTypes/types.type.'
import React, { useLayoutEffect, useState } from 'react'
import { FaPlay, FaComment } from 'react-icons/fa'
import { GoHeart } from 'react-icons/go'
import { BiRepost } from 'react-icons/bi'
import styled from 'styled-components'

const StyledUl = styled.ul`
  display: flex;
  align-items: center;

  & li {
    display: flex;
    align-items: center;
    height: 20px;
    font-size: 12px;
    margin-right: 10px;

    &:last-child {
      margin-right: 0;
    }

    & .icon {
      margin-right: 5px;

      &.play {
        font-size: 10px;
      }
      &.repost {
        font-size: 14px;
      }
    }
  }
`

type VisibleOption = 'plays' | 'likes' | 'reposts' | 'comments'

export interface InteractionCountProps {
  target: IPlaylist | IMusic
  visibleOption?: VisibleOption[]
}

interface Props
  extends InteractionCountProps,
    React.HTMLAttributes<HTMLUListElement> {}

interface OptionState {
  plays: boolean
  likes: boolean
  reposts: boolean
  comments: boolean
}

const InteractionCount = ({ target, visibleOption, ...props }: Props) => {
  const [option, setOption] = useState<OptionState>({
    plays: true,
    likes: true,
    reposts: true,
    comments: true,
  })

  useLayoutEffect(() => {
    if (visibleOption) {
      const initalOption = {
        plays: false,
        likes: false,
        reposts: false,
        comments: false,
      }

      visibleOption.forEach((value) => {
        initalOption[value] = true
      })

      setOption(initalOption)
    } else {
      setOption({
        plays: true,
        likes: true,
        reposts: true,
        comments: true,
      })
    }
  }, [visibleOption])

  return (
    <StyledUl {...props}>
      {'title' in target && target.count && option.plays ? (
        <li title={`${target.count.toLocaleString()} plays`}>
          <FaPlay className="icon play" />
          {numberFormat(target.count)}
        </li>
      ) : (
        <></>
      )}
      {target.likesCount && option.likes ? (
        <li title={`${numberFormat(target.likesCount)} likes`}>
          <GoHeart className="icon heart" />
          {numberFormat(target.likesCount)}
        </li>
      ) : (
        <></>
      )}
      {target.repostsCount && option.reposts ? (
        <li title={`${numberFormat(target.repostsCount)} reposts`}>
          <BiRepost className="icon repost" />
          {numberFormat(target.repostsCount)}
        </li>
      ) : (
        <></>
      )}
      {'title' in target && target.commentsCount && option.comments ? (
        <li title={`${numberFormat(target.commentsCount)} comments`}>
          <FaComment className="icon comment" />
          {numberFormat(target.commentsCount)}
        </li>
      ) : (
        <></>
      )}
    </StyledUl>
  )
}

export default InteractionCount
