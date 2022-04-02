import styled from 'styled-components'

export const Drawer = styled.div<{ open: boolean }>`
  z-index: 1000;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 81px;
  visibility: ${({ open }) => (open ? 'visible' : 'hidden')};
  transform: ${({ open }) => !open && 'translateX(100%)'};
  transition: ease all 0.3s;
  background-color: ${({ theme }) => theme.colors.bgColor};
`

export const Container = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
`
