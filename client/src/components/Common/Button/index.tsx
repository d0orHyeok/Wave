import React from 'react'
import styled from 'styled-components'

type ButtonProps = React.HTMLAttributes<HTMLButtonElement>

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
  return <StyledSecondaryButton {...props}>{props.children}</StyledSecondaryButton>
}

export { PrimaryButton, SecondaryButton }
export default Button
