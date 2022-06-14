import React from 'react'
import styled from 'styled-components'
import LoadingBar from './LoadingBar'

const StyledDiv = styled.div<{ hide?: boolean }>`
  display: ${({ hide }) => (hide ? 'none' : 'flex')};
  align-items: center;
  justify-content: center;
  margin: 30px 0;
`

interface LodaingAreaProps extends React.HTMLAttributes<HTMLDivElement> {
  loading: boolean
  ref: (node?: Element | null) => void
  hide?: boolean
}

const LoadingArea = ({ loading, ...props }: LodaingAreaProps) => {
  return <StyledDiv {...props}>{loading ? <LoadingBar /> : <></>}</StyledDiv>
}

export default LoadingArea
