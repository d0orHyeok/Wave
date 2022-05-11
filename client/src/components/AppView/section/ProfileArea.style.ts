import styled from 'styled-components'
import { Menu } from '@components/Common'

export const ProfileWrapper = styled.div<{ fold: string }>`
  transform: ${({ fold }) =>
    fold === 'false' ? 'translateX(8px)' : 'translateX(0)'};
  max-width: 160px;
  border-left: none;
  border-right: none;
  display: flex;
  align-items: center;
  cursor: pointer;
  margin-left: ${({ fold }) => (fold === 'true' ? '0' : '-3px')};
  justify-content: ${({ fold }) => (fold === 'true' ? 'center' : 'left')};
  transition: ease color 0.1s;

  & .profile-username {
    display: ${({ fold }) => (fold === 'true' ? 'none' : 'block')};
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

  & .user-image {
    width: 30px;
    height: 30px;
    border-radius: 15px;
    object-fit: cover;
  }

  & .empty-image {
    margin: 5px;
    width: 20px;
    height: 20px;
  }
`

export const MyMenu = styled(Menu)<{ fold: string }>`
  & .MuiPaper-root {
    width: 160px;
    margin-left: 12px;
    margin-top: ${({ fold }) => (fold === 'true' ? '-4px' : '4px')};
    border-top: ${({ fold }) => (fold === 'false' ? 'none' : 'block')};
    box-shadow: none;
  }

  & .MuiList-root {
    padding: 0;
    background-color: ${({ theme }) => theme.colors.bgColorRGBA(0.08)};
  }
`
