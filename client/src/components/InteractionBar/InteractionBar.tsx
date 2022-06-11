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
  setTarget?: React.Dispatch<React.SetStateAction<any>>
  visibleOption?: VisibleOption[]
  mediaSize?: string | number
}

const InteractionBar = ({
  target,
  setTarget,
  visibleOption,
  mediaSize,
  ...props
}: InteractionBarProps) => {
  return (
    <Container {...props}>
      <InteractionButtons
        className="interactionButtons"
        target={target}
        setTarget={setTarget}
        mediaSize={mediaSize}
      />
      <InteractionCount
        className="interactionCount"
        target={target}
        visibleOption={visibleOption}
      />
    </Container>
  )
}

export default InteractionBar
