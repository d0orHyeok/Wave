import React from 'react'
import styled from 'styled-components'
import { BsSearch } from 'react-icons/bs'

const Wrapper = styled.div`
  padding: 10vh 0;
  text-align: center;
  color: ${({ theme }) => theme.colors.bgTextRGBA(0.6)};

  & .text {
    font-size: 16px;
    margin-top: 10vh;
  }

  & .icon {
    font-size: 200px;
  }
`

interface NoSearchResultProps {
  keyward?: string
}

const NoSearchResult = ({ keyward }: NoSearchResultProps) => {
  return (
    <Wrapper>
      <BsSearch className="icon" />
      <div className="text">
        {`Sorry we didn't find any results for "${keyward || ''}".`}
      </div>
    </Wrapper>
  )
}

export default NoSearchResult
