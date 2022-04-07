import Logo from '@components/Logo/Logo'
import React from 'react'
import styled from 'styled-components'

const StyledContainer = styled.div`
  height: 100%;
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
    <StyledContainer>
      <Logo />
      <h1 className="notfound-title">페이지가 존재하지 않습니다.</h1>
      <p className="notfound-description">
        링크를 잘못입력하셨거나 페이지가 삭제/이동 되었을 수 있습니다.
      </p>
    </StyledContainer>
  )
}

export default NotFound
