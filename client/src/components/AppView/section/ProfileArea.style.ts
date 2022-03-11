import styled from 'styled-components'
import { Menu, MenuItem } from '@mui/material'

export const ProfileWrapper = styled.div`
  margin-bottom: 2rem;
  border-radius: 10px;
  padding: 0 0.5rem;
  border-left: none;
  border-right: none;
  display: flex;
  align-items: center;
  cursor: pointer;
`

export const ImageArea = styled.div`
  display: inline-block;
  margin-right: 0.5rem;
  width: 30px;
  height: 30px;
  border-radius: 15px;
  background-color: ${({ theme }) => theme.colors.bgColorRGBA('0.12')};
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

export const MyMenu = styled(Menu)`
  .MuiPaper-root {
    color: ${({ theme }) => theme.colors.bgText};
    background-color: ${({ theme }) => theme.colors.bgColor};
    width: 160px;
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
