import React from 'react'
import styled from 'styled-components'
import { BiSearchAlt2 } from 'react-icons/bi'

const Container = styled.div`
  min-height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  & h1 {
    font-size: 30px;
    text-align: center;
  }
`

const IconNotFound = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 320px;
  height: 320px;
`

const CircleOpps = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  width: 150px;
  height: 150px;
  background: rgb(203, 122, 255);
  background: radial-gradient(
    circle,
    rgba(203, 122, 255, 1) 0%,
    rgba(196, 112, 250, 1) 30%,
    rgba(185, 86, 250, 1) 100%
  );
  border-radius: 75px;
  text-align: center;
  font-size: 30px;
  line-height: 150px;
`

const StyledBiSearchAlt2 = styled(BiSearchAlt2)`
  width: 250px;
  height: 250px;
`

const CanNotFind = (props: { text?: string }) => {
  return (
    <Container>
      <IconNotFound>
        <CircleOpps>Opps!</CircleOpps>
        <StyledBiSearchAlt2></StyledBiSearchAlt2>
      </IconNotFound>
      <h1>{`We can’t find that ${props.text || 'item'}.`}</h1>
    </Container>
  )
}

export default CanNotFind
