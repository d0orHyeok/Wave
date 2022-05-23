import React from 'react'
import styled from 'styled-components'
import { IoMdHeart, IoMdHeartEmpty } from 'react-icons/io'
import { BiShuffle, BiDotsHorizontalRounded } from 'react-icons/bi'
import { RiRepeat2Line, RiRepeatOneLine } from 'react-icons/ri'
import {
  BsFillPersonCheckFill,
  BsPersonPlusFill,
  BsPersonPlus,
} from 'react-icons/bs'

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement>

export interface IShuffleButtonProps extends ButtonProps {
  shuffle?: boolean
}

export interface IRepeatButtonProps extends ButtonProps {
  repeat?: 'one' | 'all'
}

export interface ILikeButtonProps extends ButtonProps {
  isLike?: boolean
}

export interface IFollowButtonProps extends ButtonProps {
  isFollow?: boolean
}

const StyledButton = styled.button`
  padding: 0;
  color: inherit;
  cursor: pointer;
  border: 1px solid ${({ theme }) => theme.colors.border1};
  transition: 0.1s ease all;

  &:hover {
    border: 1px solid ${({ theme }) => theme.colors.border2};
  }
`

const StyledPriamryButton = styled(StyledButton)`
  color: ${({ theme }) => theme.colors.primaryText};
  background-color: ${({ theme }) => theme.colors.primaryColor};

  &:hover {
    filter: brightness(95%);
  }
`

const StyledSecondaryButton = styled(StyledButton)`
  color: ${({ theme }) => theme.colors.secondaryText};
  background-color: ${({ theme }) => theme.colors.secondaryColor};
`

const Button = (props: ButtonProps) => {
  return <StyledButton {...props}>{props.children}</StyledButton>
}

const PrimaryButton = (props: ButtonProps) => {
  return <StyledPriamryButton {...props}>{props.children}</StyledPriamryButton>
}

const SecondaryButton = (props: ButtonProps) => {
  return (
    <StyledSecondaryButton {...props}>{props.children}</StyledSecondaryButton>
  )
}

const SvgBtn = styled.button`
  padding: 0;
  border: none;
  background: none;
  font-size: inherit;

  & svg {
    width: 100%;
    height: 100%;
  }
`

const SpecialBtn = styled(SvgBtn)<{ active?: boolean }>`
  color: ${({ theme, active }) =>
    active ? theme.colors.bgText : theme.colors.bgTextRGBA(0.6)};
  padding: 0;
  border: none;
  background: none;
  width: 20px;
  height: 20px;
`

const ShuffleButton = ({ shuffle, ...props }: IShuffleButtonProps) => {
  return (
    <SpecialBtn {...props} active={shuffle}>
      <BiShuffle />
    </SpecialBtn>
  )
}

const RepeatButton = ({ repeat, ...props }: IRepeatButtonProps) => {
  return (
    <SpecialBtn {...props} active={repeat !== undefined}>
      {repeat === 'one' ? <RiRepeatOneLine /> : <RiRepeat2Line />}
    </SpecialBtn>
  )
}

const LikeBtn = styled(SvgBtn)<{ isLike?: boolean }>`
  color: ${({ isLike, theme }) => isLike && theme.colors.errorColor};
`

const FollowBtn = styled(SvgBtn)<{ isFollow?: boolean }>`
  color: ${({ isFollow, theme }) => isFollow && theme.colors.primaryColor};
`

const LikeButton = ({ isLike, ...props }: ILikeButtonProps) => {
  return (
    <LikeBtn isLike={isLike} {...props}>
      {isLike ? <IoMdHeart /> : <IoMdHeartEmpty />}
    </LikeBtn>
  )
}

const LikeFilledButton = ({ isLike, ...props }: ILikeButtonProps) => {
  return (
    <LikeBtn isLike={isLike} {...props}>
      <IoMdHeart />
    </LikeBtn>
  )
}

const FollowButton = ({ isFollow, ...props }: IFollowButtonProps) => {
  return (
    <FollowBtn isFollow={isFollow} {...props}>
      {isFollow ? <BsPersonPlusFill /> : <BsPersonPlus />}
    </FollowBtn>
  )
}

const FollowTextBtn = styled.button<{ isFollow?: boolean }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme, isFollow }) =>
    isFollow ? theme.colors.primaryColor : theme.colors.bgText};
  background-color: ${({ theme, isFollow }) =>
    isFollow ? 'none' : theme.colors.primaryColor};
  & .icon {
    margin-right: 8px;
  }
`

const FollowTextButton = ({ isFollow, ...props }: IFollowButtonProps) => {
  return (
    <FollowTextBtn isFollow={isFollow} {...props}>
      {isFollow ? (
        <BsFillPersonCheckFill className="icon" />
      ) : (
        <BsPersonPlus className="icon" />
      )}
      {isFollow ? 'following' : 'follow'}
    </FollowTextBtn>
  )
}

const MoreButton = (props: ButtonProps) => {
  return (
    <SvgBtn {...props}>
      <BiDotsHorizontalRounded />
    </SvgBtn>
  )
}

export {
  PrimaryButton,
  SecondaryButton,
  ShuffleButton,
  RepeatButton,
  LikeButton,
  LikeFilledButton,
  FollowButton,
  FollowTextButton,
  MoreButton,
}
export default Button
