import { InnerModalContainer, InnerModalWrapper } from './../common.style'
import styled from 'styled-components'
import Button, { PrimaryButton } from '@components/Common/Button'

export const Wrapper = styled(InnerModalWrapper)`
  max-width: 500px;

  @media only screen and (max-width: 600px) {
    width: 80%;
  }
`

export const Container = styled(InnerModalContainer)`
  font-size: 14px;

  & .title {
    font-size: 16px;
  }
`

export const TitleUllist = styled.ul`
  display: flex;
`

export const TitleItem = styled.li<{ select?: boolean }>`
  position: relative;
  margin-right: 1rem;
  cursor: pointer;
  color: ${({ theme, select }) =>
    select ? theme.colors.primaryColor : 'inherit'};
  padding-bottom: 0.75rem;

  &:last-child {
    margin-right: 0;
  }

  &::after {
    display: ${({ select }) => (select ? 'block' : 'none')};
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 2px;
    background-color: ${({ theme, select }) =>
      select ? theme.colors.primaryColor : theme.colors.bgText};
  }
  &:hover::after {
    display: block;
  }
`

export const TextInput = styled.input`
  background-color: ${({ theme }) => theme.colors.bgColorRGBA(0.16)};
  border: 1px solid ${({ theme }) => theme.colors.border1};
  color: ${({ theme }) => theme.colors.bgText};
  padding: 4px;
  border-radius: 3px;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.border2};
  }
`

export const Content = styled.div`
  padding: 2rem 0;
`

// AddPlaylist
export const AddContent = styled(Content)`
  padding-bottom: 0;
`

export const PlaylistItem = styled.li`
  display: flex;
  align-items: center;
  padding: 12px 0;
  height: 74px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border1};

  &:last-child {
    border-bottom: none;
    padding-bottom: 0;
    height: 62px;
  }

  & .image {
    flex-shrink: 0;
    height: 50px;
    width: 50px;
    margin-right: 12px;
  }

  & .info {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
`

export const AddButton = styled(Button)<{ added: boolean }>`
  margin-left: auto;
  flex-shrink: 0;
  padding: 4px;
  border-radius: 4px;
  ${({ added, theme }) =>
    added &&
    `
    &,
    &:hover {
      border-color: ${theme.colors.primaryColor};
      color: ${theme.colors.primaryColor};
    }`};
`

// CreatePlaylist
export const CreatePlaylist = styled(Content)`
  & .inputBox {
    margin-bottom: 1rem;
  }

  & .inputBox.flex {
    display: flex;
  }
`

export const Label = styled.h2`
  margin-bottom: 0.5rem;
  & span {
    color: ${({ theme }) => theme.colors.errorColor};
  }
`

export const SaveButton = styled(PrimaryButton)`
  padding: 2px 6px;
  border-radius: 3px;
`

export const AddMusicsWrapper = styled.ul`
  border: 1px solid ${({ theme }) => theme.colors.border1};
`

export const AddItem = styled.li`
  height: 30px;
  position: relative;
  display: flex;
  align-items: center;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border1};

  &:last-child {
    border-bottom: none;
  }

  & .music-cover {
    flex-shrink: 0;
    margin-right: 8px;
    width: 30px;
    height: 28px;
    & .img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  & .music-name {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;

    & span {
      color: ${({ theme }) => theme.colors.bgTextRGBA(0.6)};
    }
  }

  & .music-close {
    flex-shrink: 0;
    margin-left: auto;
    width: 30px;
    border: none;
    color: ${({ theme }) => theme.colors.bgTextRGBA(0.6)};
    &:hover {
      color: ${({ theme }) => theme.colors.bgTextRGBA(0.86)};
    }
    & svg {
      transform: translateY(1px);
    }
  }
`
