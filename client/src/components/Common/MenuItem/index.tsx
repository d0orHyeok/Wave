import React from 'react'
import styled from 'styled-components'
import { MenuItem as MuiMenuItem, MenuItemProps } from '@mui/material'

export const MyMenuItem = styled(MuiMenuItem)`
  &.MuiMenuItem-root:hover {
    background-color: ${({ theme }) => theme.colors.border1};
  }
`

const MenuItem = (props: MenuItemProps) => {
  return <MyMenuItem {...props}>{props.children}</MyMenuItem>
}

export default MenuItem
