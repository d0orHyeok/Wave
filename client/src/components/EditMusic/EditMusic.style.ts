import styled from 'styled-components'

export const Container = styled.div`
  margin: 0 auto;
  max-width: 900px;
  padding: 0 50px;
  min-width: 300px;
  width: 100%;
`

export const EditMain = styled.div`
  box-shadow: 0px 0px 3px 1px ${({ theme }) => theme.colors.border1};
  padding: 1rem;
`

export const EditNav = styled.div`
  display: flex;
  align-items: center;
  border-bottom: 1px solid ${({ theme }) => theme.colors.bgColorRGBA(0.03)};
`

export const EditNavItem = styled.span<{ select?: boolean }>`
  padding: 0.5rem 0 1rem 0;
  font-size: 1.3rem;
  position: relative;
  margin-right: 1rem;
  cursor: pointer;
  color: ${({ theme, select }) =>
    select ? theme.colors.primaryColor : theme.colors.bgText};

  &:last-child {
    margin-right: 0;
  }

  &::after {
    content: '';
    position: absolute;
    left: 0;
    bottom: 0;
    width: 100%;
    height: 2px;
    background-color: ${({ theme, select }) =>
      select ? theme.colors.primaryColor : theme.colors.bgText};
    display: ${({ select }) => (select ? 'block' : 'none')};
  }

  &:hover {
    &::after {
      display: block;
    }
  }

  ${({ theme }) => theme.device.tablet} {
    font-size: 1.1rem;
  }
`
