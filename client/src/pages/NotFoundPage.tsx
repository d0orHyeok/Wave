import Logo from '@components/Logo/Logo'
import React from 'react'
import styled from 'styled-components'
import { Helmet } from 'react-helmet'

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

const NotFoundPage = () => {
  return (
    <>
      <Helmet>
        <title>Notfound | Wave</title>
      </Helmet>
      <StyledContainer>
        <Logo />
        <h1 className="notfound-title">Page Notfound</h1>
        <p className="notfound-description">
          You may have entered the link incorrectly or the page may have been
          deleted/moved.
        </p>
      </StyledContainer>
    </>
  )
}

export default NotFoundPage
