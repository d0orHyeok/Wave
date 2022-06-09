import React from 'react'
import styled from 'styled-components'
import LoadingBar from './LoadingBar'

const Wrapper = styled.div`
  min-height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`

const Loading = () => {
  return (
    <Wrapper>
      <LoadingBar />
    </Wrapper>
  )
}

export default Loading
