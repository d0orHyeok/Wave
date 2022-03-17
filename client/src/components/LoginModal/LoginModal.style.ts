import styled from 'styled-components'
import { PrimaryButton } from '@components/Common/Button'

export const ModalWrapper = styled.div`
  position: absolute;
  top: 40%;
  left: 50%;
  transform: translate(-50%, -50%);
  border-radius: 16px;
  background-color: ${({ theme }) => theme.colors.bgColor};
  color: ${({ theme }) => theme.colors.bgText};
`

export const StyledContainer = styled.div`
  padding: 20px;
  width: 420px;
  height: 400px;
  display: flex;
  flex-direction: column;
  align-items: center;

  & .modal-title {
    font-size: 1.2rem;
    margin: 2rem 0;
    font-weight: bold;
  }

  & .signin-loginbox {
    font-size: 0.9rem;
    & input {
      margin: 0;
      margin-right: 8px;
    }
  }

  & .signin-more {
    display: flex;
    justify-content: space-between;
    font-size: 0.8rem;

    & ul li {
      margin-right: 16px;
      position: relative;
      color: ${({ theme }) => theme.colors.bgTextRGBA('0.6')};
      display: inline-block;

      & a:hover {
        color: ${({ theme }) => theme.colors.primaryColor};
      }

      &:first-child::after {
        top: 50%;
        transform: translate(7px, -50%);
        position: absolute;
        content: '';
        width: 2px;
        height: 1em;
        background-color: ${({ theme }) => theme.colors.bgTextRGBA('0.6')};
      }
    }
  }
`

export const Box = styled.div`
  width: 300px;
`

export const LoginButton = styled(PrimaryButton)`
  margin: 1rem 0;
  width: 300px;
  height: 50px;
  font-size: 1rem;
  font-weight: bold;
  border-radius: 4px;
`
