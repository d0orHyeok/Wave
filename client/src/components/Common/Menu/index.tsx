import React from 'react'
import styled from 'styled-components'
import { Menu as MuiMenu, MenuProps } from '@mui/material'

const StyledMenu = styled(MuiMenu)`
  & .MuiPaper-root {
    color: ${({ theme }) => theme.colors.bgText};
    background-color: ${({ theme }) => theme.colors.bgColor};
    border: 1px solid ${({ theme }) => theme.colors.border1};
    box-shadow: none;
  }
`

const Menu = (props: MenuProps) => {
  return <StyledMenu {...props}>{props.children}</StyledMenu>
}

export default Menu
