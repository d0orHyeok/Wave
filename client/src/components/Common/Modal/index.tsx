import React from 'react'
import styled from 'styled-components'
import { Modal as MuiModal, ModalProps } from '@mui/material'
import { useAppTheme } from '@redux/context/appThemeProvider'

const StyledModal = styled(MuiModal)<{ appTheme: string }>`
  & .MuiBackdrop-root {
    background-color: ${({ appTheme }) => (appTheme === 'dark' ? 'rgba(18,18,18,0.38)' : 'rgba(255,255,255,0.38)')};
  }
`

const Modal = (props: ModalProps) => {
  const appTheme = useAppTheme()[0]

  return (
    <StyledModal {...props} appTheme={appTheme}>
      {props.children}
    </StyledModal>
  )
}

export default Modal
