import React from 'react'
import styled from 'styled-components'
import LoadingBar from './LoadingBar'
import { InView } from 'react-intersection-observer'

const StyledDiv = styled.div<{ hide?: boolean }>`
  display: ${({ hide }) => (hide ? 'none' : 'flex')};
  align-items: center;
  justify-content: center;
  height: 200px;
`

interface LodaingAreaProps extends React.HTMLAttributes<HTMLDivElement> {
  loading: boolean
  hide?: boolean
  onInView?: (inView: boolean) => void
}

const LoadingArea = ({ loading, onInView, ...props }: LodaingAreaProps) => {
  return (
    <InView as="div" onChange={onInView}>
      <StyledDiv {...props}>{loading ? <LoadingBar /> : <></>}</StyledDiv>
    </InView>
  )
}

export default LoadingArea
