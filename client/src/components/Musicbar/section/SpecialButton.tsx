import React from 'react'
import styled from 'styled-components'
import { BiShuffle } from 'react-icons/bi'
import { RiRepeat2Line, RiRepeatOneLine } from 'react-icons/ri'

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement>

export interface IShuffleBtnProps extends ButtonProps {
  shuffle?: boolean
}

export interface IRepeatBtnProps extends ButtonProps {
  repeat?: 'one' | 'all'
}

const SpecialBtn = styled.button<{ active?: boolean }>`
  color: ${({ theme, active }) =>
    active ? theme.colors.bgText : theme.colors.bgTextRGBA(0.6)};
  padding: 0;
  border: none;
  background: none;
  width: 20px;
  height: 20px;

  & svg {
    width: 100%;
    height: 100%;
  }
`

const ShuffleBtn = styled(SpecialBtn)``

const RepeatBtn = styled(SpecialBtn)``

const ShuffleButton = ({ shuffle, ...props }: IShuffleBtnProps) => {
  return (
    <ShuffleBtn {...props} active={shuffle}>
      <BiShuffle />
    </ShuffleBtn>
  )
}

const RepeatButton = ({ repeat, ...props }: IRepeatBtnProps) => {
  return (
    <RepeatBtn {...props} active={repeat !== undefined}>
      {repeat === 'one' ? <RiRepeatOneLine /> : <RiRepeat2Line />}
    </RepeatBtn>
  )
}

export { ShuffleButton, RepeatButton }
