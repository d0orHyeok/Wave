import { CircularProgress } from '@mui/material'
import React from 'react'
import styled from 'styled-components'

const Wrapper = styled.div`
  min-height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`

const Loading = () => {
  return (
    <Wrapper>
      <CircularProgress color="secondary" size={100} />
    </Wrapper>
  )
}

export default Loading
