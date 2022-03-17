import React from 'react'
import styled from 'styled-components'

interface TextFieldProps
  extends React.InputHTMLAttributes<HTMLInputElement>,
    TextFieldStyledProps {
  errorText?: string
}

interface TextFieldStyledProps {
  error?: boolean
  success?: boolean
}

const StyledTextFieldWrapper = styled.div`
  position: relative;
  display: inline-block;
  border: none;
  height: auto;
  background-color: ${({ theme }) => theme.colors.bgColor};
  z-index: 5;
`

const StyledErrorText = styled.span`
  position: absolute;
  display: inline-flex;
  align-items: flex-end;
  padding: 2px 8px;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  height: 100%;
  color: ${({ theme }) => theme.colors.errorColor};
  font-size: 12px;
`

const StyledTextField = styled.input<TextFieldStyledProps>`
  box-sizing: border-box;
  width: 100%;
  height: 50px;
  position: relative;
  z-index: 5;
  color: inherit;
  border-radius: 4px;
  padding: 16px 8px;
  font-size: 1rem;
  outline: none;
  caret-color: ${({ theme }) => theme.colors.secondaryColor};
  border: 1px solid ${({ theme }) => theme.colors.border1};
  background-color: ${({ theme }) => theme.colors.bgColorRGBA('0.06')};
  &:focus {
    border: 2px solid ${({ theme }) => theme.colors.bgText};
    padding: 16px 7px;
  }
  &,
  &:focus {
    border-color: ${({ theme, success, error }) =>
      success ? theme.colors.primaryColor : error && theme.colors.errorColor};
  }
  &:focus + .AppInput-errorText {
  }
`

const TextField = ({
  errorText,
  style,
  className,
  ...props
}: TextFieldProps) => {
  return (
    <StyledTextFieldWrapper className={className} style={style}>
      <StyledTextField {...props} />
      {props.error && (
        <StyledErrorText className="AppInput-errorText">
          {errorText}
        </StyledErrorText>
      )}
    </StyledTextFieldWrapper>
  )
}

export default React.memo(TextField)
