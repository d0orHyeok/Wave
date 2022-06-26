import styled from 'styled-components'

export const LoadingBox = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
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
