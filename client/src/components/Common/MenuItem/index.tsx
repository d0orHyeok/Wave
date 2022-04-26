import styled from 'styled-components'
import { MenuItem as MuiMenuItem, MenuItemProps } from '@mui/material'
import { MdPlaylistAdd, MdPlaylistPlay } from 'react-icons/md'
import { useAppDispatch } from '@redux/hook'
import { addMusic } from '@redux/features/player/playerSlice'
import { IMusic } from '@redux/features/player/palyerSlice.interface'
import React, { useCallback } from 'react'

const MenuItem = styled(MuiMenuItem)`
  &.MuiMenuItem-root:hover {
    background-color: ${({ theme }) => theme.colors.border1};
  }
`

const MusicMenuItem = styled(MenuItem)`
  font-size: 16px;
  line-height: 16px;

  ${({ theme }) => theme.device.tablet} {
    font-size: 14px;
    line-height: 14px;
  }
  ${({ theme }) => theme.device.mobile} {
    font-size: 12px;
    line-height: 12px;
  }

  &.MuiMenuItem-root {
    padding: 0.5em 0;
    font-size: 0.75em;
    border-bottom: 1px solid ${({ theme }) => theme.colors.border1};

    &:last-child {
      border-bottom: none;
    }
  }

  & .icon {
    margin: 0 0.5em;
    width: 16px;
    height: 16px;
  }
`

interface ICustionMusicMenuItemProps extends MenuItemProps {
  onClose?: React.MouseEventHandler<HTMLLIElement | HTMLElement>
}

interface IAddMusicMenuItemProps extends ICustionMusicMenuItemProps {
  music?: IMusic
}

const AddMusicMenuItem = ({
  music,
  onClick,
  onClose,
  ...props
}: IAddMusicMenuItemProps) => {
  const dispatch = useAppDispatch()

  const handleClick = useCallback(
    (event: React.MouseEvent<HTMLLIElement>) => {
      if (onClick) {
        onClick(event)
      } else {
        if (music) {
          dispatch(addMusic(music))
        }
        onClose && onClose(event)
      }
    },
    [dispatch, music, onClick, onClose]
  )

  return (
    <MusicMenuItem onClick={handleClick} {...props}>
      <MdPlaylistPlay className="icon" />
      <span>재생목록에 추가</span>
    </MusicMenuItem>
  )
}

const AddPlaylistMenuItem = ({
  onClick,
  onClose,
  ...props
}: ICustionMusicMenuItemProps) => {
  const handleClick = useCallback(
    (event: React.MouseEvent<HTMLLIElement>) => {
      if (onClick) {
        onClick(event)
      } else {
        onClose && onClose(event)
      }
    },
    [onClick, onClose]
  )

  return (
    <MusicMenuItem onClick={handleClick} {...props}>
      <MdPlaylistAdd className="icon" />
      <span>플레이리스트에 추가</span>
    </MusicMenuItem>
  )
}

export { MusicMenuItem, AddMusicMenuItem, AddPlaylistMenuItem }
export default MenuItem
