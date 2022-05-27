import { numberFormat } from '@api/functions'
import { IMusic, IPlaylist } from '@redux/features/player/palyerSlice.interface'
import React from 'react'
import { FaPlay } from 'react-icons/fa'
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

interface InteractionCountProps extends React.HTMLAttributes<HTMLUListElement> {
  target: IPlaylist | IMusic
}

const InteractionCount = ({ target, ...props }: InteractionCountProps) => {
  return 'title' in target ? (
    <StyledUl {...props}>
      {target.count > 0 ? (
        <li title={`${target.count.toLocaleString()} plays`}>
          <FaPlay className="icon play" />
          {numberFormat(target.count)}
        </li>
      ) : (
        <></>
      )}
      {target.likesCount > 0 ? (
        <li title={`${numberFormat(target.likesCount)} likes`}>
          <GoHeart className="icon heart" />
          {numberFormat(target.likesCount)}
        </li>
      ) : (
        <></>
      )}
      {target.repostsCount ? (
        <li title={`${numberFormat(target.repostsCount)} reposts`}>
          <BiRepost className="icon repost" />
          {numberFormat(target.repostsCount)}
        </li>
      ) : (
        <></>
      )}
    </StyledUl>
  ) : (
    <></>
    // <StyledUl {...props}>
    //   {target.likes?.length > 0 ? (
    //     <li title={`${numberFormat(target.likes.length)} likes`}>
    //       <GoHeart className="icon heart" />
    //       {numberFormat(target.likes.length)}
    //     </li>
    //   ) : (
    //     <></>
    //   )}
    //   {target.reposts?.length ? (
    //     <li title={`${numberFormat(target.reposts.length)} reposts`}>
    //       <BiRepost className="icon repost" />
    //       {numberFormat(target.reposts.length)}
    //     </li>
    //   ) : (
    //     <></>
    //   )}
    // </StyledUl>
  )
}

export default InteractionCount
