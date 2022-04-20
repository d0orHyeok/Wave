import styled from 'styled-components'
import { MenuItem as MuiMenuItem } from '@mui/material'

const MenuItem = styled(MuiMenuItem)`
  &.MuiMenuItem-root:hover {
    background-color: ${({ theme }) => theme.colors.border1};
  }
`

const MusicMenuItem = styled(MenuItem)`
  &.MuiMenuItem-root {
    padding: 8px 0;
    font-size: 0.75rem;
    border-bottom: 1px solid ${({ theme }) => theme.colors.border1};

    &:last-child {
      border-bottom: none;
    }
  }

  & .icon {
    margin: 0 8px;
    width: 16px;
    height: 16px;
  }
`
export { MusicMenuItem }
export default MenuItem
