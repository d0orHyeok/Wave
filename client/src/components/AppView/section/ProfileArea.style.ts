import styled from 'styled-components'
import { Menu } from '@components/Common'

export const ProfileWrapper = styled.div<{ fold: boolean }>`
  transform: ${({ fold }) => !fold && 'translateX(8px)'};
  max-width: 160px;
  border-left: none;
  border-right: none;
  display: flex;
  align-items: center;
  cursor: pointer;
  margin-left: ${({ fold }) => (fold ? '0' : '-3px')};
  justify-content: ${({ fold }) => (fold ? 'center' : 'left')};
  transition: ease color 0.1s;

  & .profile-username {
    display: ${({ fold }) => fold && 'none'};
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    margin-left: 8px;
  }
`

export const ImageArea = styled.div`
  display: inline-block;
  width: 30px;
  height: 30px;
  border-radius: 15px;
  background-color: ${({ theme }) => theme.colors.bgColorRGBA('0.3')};
  & .empty-image {
    margin: 5px;
    width: 20px;
    height: 20px;
  }
  & .user-image {
    width: 30px;
    height: 30px;
    border-radius: 15px;
  }
`

export const MyMenu = styled(Menu)<{ fold: boolean }>`
  & .MuiPaper-root {
    width: 160px;
    margin-left: 12px;
    margin-top: ${({ fold }) => (fold ? '-4px' : '4px')};
    border-top: ${({ fold }) => !fold && 'none'};
    box-shadow: none;
  }

  & .MuiList-root {
    padding: 0;
    background-color: ${({ theme }) => theme.colors.bgColorRGBA(0.08)};
  }
`
