import React from 'react'
import styled from 'styled-components'
import { Menu as MuiMenu, MenuProps } from '@mui/material'

const StyledMenu = styled(MuiMenu)`
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

const Menu = (props: MenuProps) => {
  return <StyledMenu {...props}>{props.children}</StyledMenu>
}

export default Menu
