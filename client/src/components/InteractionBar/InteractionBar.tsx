import React from 'react'
import styled from 'styled-components'
import { IMusic, IPlaylist } from '@redux/features/player/palyerSlice.interface'
import InteractionButtons from './InteractionButtons'
import InteractionCount, { VisibleOption } from './InteractionCount'

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;

  * > & {
    flex-shrink: 0;
  }
`

interface InteractionBarProps extends React.HTMLAttributes<HTMLDivElement> {
  target: IMusic | IPlaylist
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setTarget?: React.Dispatch<React.SetStateAction<any>>
  visibleOption?: VisibleOption[]
}

const InteractionBar = ({
  target,
  setTarget,
  visibleOption,
  ...props
}: InteractionBarProps) => {
  return (
    <Container {...props}>
      <InteractionButtons target={target} setTarget={setTarget} />
      <InteractionCount target={target} visibleOption={visibleOption} />
    </Container>
  )
}

export default InteractionBar
