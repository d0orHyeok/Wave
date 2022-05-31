import { Divider } from '@mui/material'
import styled from 'styled-components'

export const Wrapper = styled.div`
  min-height: 100%;
  max-width: 1200px;
  width: 100%;
  margin: 0 auto;
  font-size: 14px;
  line-height: 14px;
`

interface ContainerProps {
  related?: boolean
  minHeight?: string
}

export const Container = styled.div<ContainerProps>`
  position: relative;
  padding: 20px;
  padding-right: ${({ related }) => (related ? '320px' : '20px')};
  height: 100%;
  ${({ minHeight }) => minHeight && `min-height: ${minHeight};`}

  & .interaction {
    margin: 15px 0 10px 0;
  }

  ${({ theme }) => theme.device.tablet} {
    position: static;
    padding-right: 20px;
  }
`

export const SideContent = styled.div`
  flex-shrink: 0;
  width: 300px;
  padding: 0 20px;
  border-left: 1px solid ${({ theme }) => theme.colors.border1};

  position: absolute;
  top: 20px;
  right: 0;
  height: calc(100% - 40px);

  ${({ theme }) => theme.device.tablet} {
    position: static;
    margin-left: 20px;
    flex-grow: 1;
    padding-right: 0;
    width: auto;
    height: auto;
  }

  @media screen and (max-width: 600px) {
    border-left: none;
    padding: 0;
    margin: 0;
    margin-top: 20px;
  }
`

export const StyledDivider = styled(Divider)`
  background-color: ${({ theme }) => theme.colors.border1};
`

export const Content = styled.div<{ media?: number }>`
  padding-top: 15px;
  display: flex;

  & .media-divider {
    display: none;
  }

  @media screen and (max-width: ${({ media }) => (media ? media : '800')}px) {
    flex-direction: column;
    & .subcontent {
      width: 100%;
      justify-content: center;
    }
    & .media-divider {
      display: block;
    }
    & .maincontent {
      margin-left: 0;
    }
  }
`

export const SubContent = styled.div`
  display: flex;

  @media screen and (max-width: 600px) {
    display: block;
    position: relative;

    & .content-uploader {
      position: relative;
      left: 50%;
      transform: translateX(-50%);
    }
  }
`

export const MainContent = styled.div`
  min-width: 0;
  width: 100%;
  margin-left: 20px;
  color: ${({ theme }) => theme.colors.bgTextRGBA(0.6)};

  & .content-info {
    &:not(:last-child) {
      margin-bottom: 20px;
    }

    &.content-description {
      white-space: normal;
      word-wrap: break-word;
    }
  }

  & .content-tags {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    font-size: 13px;

    & .content-tags-item {
      flex-shrink: 0;
      color: white;
      background-color: gray;
      padding: 0 5px;
      height: 20px;
      line-height: 20px;
      border-radius: 10px;
      margin-bottom: 6px;

      &:hover {
        background-color: #616161;
      }

      &:not(:last-child) {
        margin-right: 10px;
      }
    }
  }
`
