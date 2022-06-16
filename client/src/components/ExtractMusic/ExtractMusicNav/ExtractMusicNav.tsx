import styled from 'styled-components'
import React from 'react'

const EditNav = styled.div`
  display: flex;
  align-items: center;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border1};
`

const EditNavItem = styled.span<{ select?: boolean }>`
  padding: 0.5rem 0 1rem 0;
  font-size: 1.3rem;
  position: relative;
  cursor: pointer;
  color: ${({ theme, select }) =>
    select ? theme.colors.primaryColor : theme.colors.bgText};

  &:not(:last-child) {
    margin-right: 1rem;
  }

  &::after {
    content: '';
    position: absolute;
    left: 0;
    bottom: 0;
    width: 100%;
    height: 2px;
    transform: translateY(1.5px);
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

interface ExtractMusicNavProps {
  navItems: string[]
  navIndex?: number
  handleClickNav?: (index: number) => void
}

interface Props
  extends ExtractMusicNavProps,
    React.HTMLAttributes<HTMLDivElement> {}

const ExtractMusicNav = ({
  navItems,
  navIndex,
  handleClickNav,
  ...props
}: Props) => {
  const handleClick =
    (index: number) => (event: React.MouseEvent<HTMLElement>) => {
      event.preventDefault()
      handleClickNav && handleClickNav(index)
    }

  return (
    <EditNav {...props}>
      {navItems.map((item, index) => (
        <EditNavItem
          key={item}
          className="editNav-item"
          onClick={handleClick(index)}
          select={navIndex === index}
        >
          {item}
        </EditNavItem>
      ))}
    </EditNav>
  )
}

export default ExtractMusicNav
