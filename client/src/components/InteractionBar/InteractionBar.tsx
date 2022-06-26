import React from 'react'
import styled from 'styled-components'
import InteractionButtons, {
  InteractionButtonsProps,
} from './InteractionButtons'
import InteractionCount, { InteractionCountProps } from './InteractionCount'

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;

  * > & {
    flex-shrink: 0;
  }
`

interface InteractionBarProps
  extends InteractionButtonsProps,
    InteractionCountProps,
    React.HTMLAttributes<HTMLDivElement> {}

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
