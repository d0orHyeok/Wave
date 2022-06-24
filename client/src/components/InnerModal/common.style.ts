import styled from 'styled-components'
import { Divider } from '@mui/material'

export const StyledDivider = styled(Divider)`
  border-color: ${({ theme }) => theme.colors.bgTextRGBA(0.16)} !important;
`

export const InnerModalWrapper = styled.div`
  position: fixed;
  top: 10%;
  left: 50%;
  transform: translateX(-50%);
  background-color: ${({ theme }) => theme.colors.bgColor};
  box-shadow: 3px 3px 10px 0 ${({ theme }) => theme.colors.bgTextRGBA(0.16)};
  border-radius: 6px;
  max-width: 850px;
  width: 100%;

  @media screen and (max-width: 1000px) {
    width: 85%;
  }
`

export const InnerModalContainer = styled.div`
  padding: 25px 0;
  max-height: 80vh;
  height: auto;
  display: flex;
  flex-direction: column;
`

const ModalItemStyle = styled.div`
  padding-right: 25px;
  padding-left: 25px;
`

export const ModalTitle = styled(ModalItemStyle)`
  flex-shrink: 0;
`

export const ModalContent = styled(ModalItemStyle)`
  overflow-y: auto;
  min-height: 0;
  min-width: 0;

  &::-webkit-scrollbar {
    width: 8px;
    background-color: inherit;
  }
  &::-webkit-scrollbar-thumb {
    border-radius: 4px;
    background-color: ${({ theme }) => theme.colors.bgTextRGBA(0.3)};
  }
`

export const ModalActions = styled(ModalItemStyle)`
  flex-shrink: 0;
`
