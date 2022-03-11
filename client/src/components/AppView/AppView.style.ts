import styled from 'styled-components'

// App Wrapper
export const AppWrapper = styled.div`
  max-width: 1920px;
  margin: 0 auto;
`

// App Header
const headerWidth = ['225px', '85px']

export const AppHeader = styled.header<{ open: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  z-index: 100;
  transition: 0.3s ease width;
  padding: 24px 0;
  width: ${({ open }) => (open ? headerWidth[0] : headerWidth[1])};
  border-right: 1px solid ${({ theme }) => theme.colors.border1};
  background-color: ${({ theme }) => theme.colors.bgColor};

  & .header-top,
  & .header-nav ul {
    padding: ${({ open }) => (open ? '0 24px' : '0 16px')};
  }
  & .header-top {
    height: 120px;
  }
  & .header-nav {
    height: calc(100% - 120px);
    overflow-y: auto;
  }
  & .header-nav::-webkit-scrollbar {
    width: 5px;
    border-radius: 2.5px;
    background-color: ${({ theme }) => theme.colors.bgColorRGBA('0.06')};
  }
  & .header-nav::-webkit-scrollbar-thumb {
    border-radius: 2.5px;
    background-color: ${({ theme }) => theme.colors.bgColorRGBA('0.16')};
  }

  & .header-logo {
    visibility: ${({ open }) => (!open ? 'hidden' : 'visible')};
  }
  & .header-fold,
  & .menuItem-link {
    justify-content: ${({ open }) => !open && 'center'};
  }
`

export const FoldMenuArea = styled.div`
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: right;
  & .header-foldBtn {
    padding: 0;
    border: none;
  }
  & .header-foldBtn svg {
    font-size: 24px;
  }
`

export const AppLogo = styled.h1`
  margin-top: 30px;
  font-size: 32px;
  & a {
    display: flex;
  }
  & svg {
    color: ${({ theme }) => theme.colors.primaryColor};
    margin-right: 8px;
  }
`

export const MenuItem = styled.li<{ active: boolean }>`
  margin-bottom: 0.5rem;
  min-width: 50px;
  height: 50px;
  border-radius: 10px;
  font-size: 16px;
  font-weight: bold;
  color: ${({ theme, active }) => (active ? theme.colors.primaryColor : theme.colors.bgText)};
  padding: 0 8px;

  &:hover {
    color: ${({ theme }) => theme.colors.primaryText};
    background-color: ${({ theme, active }) => (active ? theme.colors.primaryColor : theme.colors.bgTextRGBA('0.86'))};
  }
  &:last-child {
    margin-bottom: 0;
  }

  & .menuItem-link {
    height: 100%;
    display: flex;
    align-items: center;
  }
  & .menuItem-link svg {
    font-size: 20px;
    min-width: 20px;
  }
  & .menuItem-name {
    margin-left: 0.5rem;
  }
`

// App Container
export const AppContainer = styled.main<{ open: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  min-height: 600px;
  transition: padding-left 0.3s ease;
  padding-left: ${({ open }) => (open ? headerWidth[0] : headerWidth[1])};
  background-color: ${({ theme }) => theme.colors.bgColorRGBA('0.12')};
`

export const FloatBox = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 16px;
`
