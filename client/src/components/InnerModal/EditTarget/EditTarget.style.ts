import styled from 'styled-components'
import * as ModalStyle from '../common.style'

export const Wrapper = styled(ModalStyle.InnerModalWrapper)``

export const Container = styled(ModalStyle.InnerModalContainer)``

export const LoadingBox = styled.div`
  position: absolute;
  top: 10px;
  left: 10px;
  right: 10px;
  bottom: 10px;
  background-color: ${({ theme }) => theme.colors.bgColor};
  z-index: 10;
`

export const Buttons = styled.div`
  margin-top: 20px;
  text-align: right;
  & .buttons-btn {
    padding: 3px 8px;
    border-radius: 4px;

    &:not(:last-child) {
      margin-right: 8px;
    }

    &.save.block {
      filter: grayscale(1);
      cursor: default;
    }
  }
`
