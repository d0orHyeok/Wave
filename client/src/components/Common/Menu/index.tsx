import styled from 'styled-components'
import { Menu as MuiMenu } from '@mui/material'

const Menu = styled(MuiMenu)`
  & .MuiPaper-root {
    border-radius: 2px;
    border: none;
    color: ${({ theme }) => theme.colors.bgText};
    background-color: ${({ theme }) => theme.colors.bgColor};
  }

  & .MuiList-root {
    padding: 0;
  }
`

export const MusicMenu = styled(Menu)`
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

export default Menu
