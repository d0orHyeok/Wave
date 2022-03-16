import styled from 'styled-components'
import { Menu, MenuItem } from '@mui/material'

export const ProfileWrapper = styled.div<{ fold: boolean }>`
  padding: 0 0.5rem;
  border-left: none;
  border-right: none;
  display: flex;
  align-items: center;
  cursor: pointer;
  margin-left: ${({ fold }) => (fold ? '0' : '-3px')};
  justify-content: ${({ fold }) => (fold ? 'center' : 'left')};

  & .profile-username {
    display: ${({ fold }) => fold && 'none'};
    margin-left: 0.5rem;
  }
`

export const ImageArea = styled.div`
  display: inline-block;
  width: 30px;
  height: 30px;
  border-radius: 15px;
  background-color: ${({ theme }) => theme.colors.bgColorRGBA('0.3')};
  .empty-image {
    margin: 5px;
    width: 20px;
    height: 20px;
  }
  .user-image {
    width: 30px;
    height: 30px;
    border-radius: 15px;
  }
`

export const MyMenu = styled(Menu)<{ fold: boolean }>`
  .MuiPaper-root {
    color: ${({ theme }) => theme.colors.bgText};
    background-color: ${({ theme }) => theme.colors.bgColor};
    width: 160px;
    margin-left: 12px;
    border-radius: 0 3px 3px 0;
    box-shadow: none;
    margin-top: ${({ fold }) => (fold ? '-4px' : '4px')};
    border: 1px solid ${({ theme }) => theme.colors.border1};
    border-top: ${({ fold }) => !fold && 'none'};
  }
  .MuiMenuItem-root:hover {
    background-color: ${({ theme }) => theme.colors.border1};
  }
`

export const MyMenuItem = styled(MenuItem)`
  .MuiMenuItem-root:hover {
    background-color: ${({ theme }) => theme.colors.border1};
  }
`
