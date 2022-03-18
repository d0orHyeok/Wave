import Logo from '@components/Logo/Logo'
import React from 'react'
import styled from 'styled-components'

const StyledWrapper = styled.div`
  position: relative;
  padding: 3rem;
  height: 100%;
`

const StyledContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  & .notfound-title {
    font-size: 1.2rem;
    margin: 1rem;
  }
`

const NotFound = () => {
  return (
    <StyledWrapper>
      <StyledContainer>
        <Logo />
        <h1 className="notfound-title">페이지가 존재하지 않습니다.</h1>
        <p className="notfound-description">
          링크를 잘못입력하셨거나 페이지가 삭제/이동 되었을 수 있습니다.
        </p>
      </StyledContainer>
    </StyledWrapper>
  )
}

export default NotFound
