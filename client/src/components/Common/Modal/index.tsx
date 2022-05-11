import React, { useCallback } from 'react'
import styled from 'styled-components'
import { Modal as MuiModal, ModalProps } from '@mui/material'
import { MdClose } from 'react-icons/md'

const StyledModal = styled(MuiModal)`
  & .MuiBackdrop-root {
    background-color: rgba(${({ theme }) => theme.colors.bgColorRGB}, 0.6);
  }
`

const CloseButton = styled.button`
  position: fixed;
  top: 16px;
  right: 16px;
  border: none;
  font-size: 24px;
`

const Modal = ({ children, ...props }: ModalProps) => {
  const handleClose = useCallback(
    (event: React.MouseEvent<HTMLElement>) => {
      if (props.onClose) props.onClose(event, 'backdropClick')
    },
    [props]
  )

  return (
    <StyledModal {...props}>
      <>
        <CloseButton onClick={handleClose}>
          <MdClose />
        </CloseButton>
        {children}
      </>
    </StyledModal>
  )
}

export default Modal
