import styled from 'styled-components'
import { Menu, MenuItem } from '@components/Common'

export const Drawer = styled.div<{ open: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 81px;
  visibility: ${({ open }) => (open ? 'visible' : 'hidden')};
  transform: ${({ open }) => !open && 'translateX(100%)'};
  transition: ease all 0.3s;
  background-color: ${({ theme }) => theme.colors.bgColor};
`

export const Container = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
`

export const AreaImage = styled.div`
  margin: 0 auto;

  ${({ theme }) => theme.device.tablet} {
    display: none;
  }
`

export const MusicImage = styled.div`
  width: 480px;
  height: 480px;

  @media screen and (max-width: 1000px) {
    width: 240px;
    height: 240px;
  }

  & img {
    width: 100%;
    height: 100%;
    overflow: cover;
  }
`

export const AreaPlaylist = styled.div`
  width: 400px;
  height: 100%;
  background-color: ${({ theme }) => theme.colors.bgColorRGBA(0.03)};

  ${({ theme }) => theme.device.tablet} {
    width: 100%;
  }
`

export const PlaylistHead = styled.div`
  margin: 1rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.5rem 0;
  font-size: 1rem;

  & .button-wrap {
    display: flex;
    align-items: center;
    height: 100%;
  }

  & .btn {
    width: 1.25em;
    height: 1.25em;
    margin-right: 1rem;
    font-size: inherit;

    &:last-child {
      margin-right: 0;
    }
  }

  ${({ theme }) => theme.device.tablet} {
    font-size: 1.2rem;
  }
`

export const PlaylistContainer = styled.div``

export const PlaylistItem = styled.li<{ select?: boolean }>`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.5rem 1rem;

  background-color: ${({ theme, select }) =>
    select && theme.colors.bgColorRGBA(0.08)};

  & > * {
    flex-shrink: 0;
  }

  & .btn {
    display: none;
  }

  & .hoverIcon {
    display: ${({ select }) => !select && 'none'};
  }

  &:hover {
    background-color: ${({ theme }) => theme.colors.bgColorRGBA(0.16)};

    & .duration {
      display: none;
    }

    & .btn,
    & .hoverIcon {
      display: inline;
    }

    & .image {
      filter: brightness(50%);
    }
  }
`

export const ItemImageBox = styled.div`
  position: relative;
  width: 40px;
  height: 40px;
  cursor: pointer;

  & .image {
    height: 100%;
    width: 100%;
    object-fit: cover;
  }

  & .hoverIcon {
    color: white;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: 12px;
  }
`

export const ItemInfoBox = styled.div`
  flex-grow: 1;
  font-size: 0.8rem;
  line-height: 1rem;
  margin: 0 0.75rem;

  & .uploader,
  & .title {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
  & .uploader {
    color: ${({ theme }) => theme.colors.bgTextRGBA('0.6')};
  }
  & .title {
    color: ${({ theme }) => theme.colors.bgTextRGBA('0.86')};
  }
  & .title:hover,
  & .uploader:hover {
    color: ${({ theme }) => theme.colors.bgText};
  }
`

export const ItemControlBox = styled.div`
  position: relative;
  text-align: right;
  width: 60px;
  & .duration {
    font-size: 0.8rem;
    color: ${({ theme }) => theme.colors.bgTextRGBA(0.6)};
  }

  & .btn {
    font-size: 14px;
    border: none;
    padding: 0 5px;
  }
`

export const LikeBtn = styled.button<{ like?: boolean }>`
  color: ${({ theme, like }) => like && theme.colors.errorColor};
`

export const MyMenu = styled(Menu)`
  & .MuiPaper-root {
    border-radius: 2px;
    border: none;
    width: 160px;
  }

  & .MuiList-root {
    padding: 0;
    background-color: ${({ theme }) => theme.colors.bgColorRGBA(0.12)};
  }
`

export const MyMenuItem = styled(MenuItem)`
  &.MuiMenuItem-root {
    padding: 8px 0;
    font-size: 0.75rem;
    border-bottom: 1px solid ${({ theme }) => theme.colors.border1};

    &:last-child {
      border-bottom: none;
    }
  }

  & .icon {
    margin: 0 8px;
    width: 16px;
    height: 16px;
  }
`