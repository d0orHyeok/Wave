import styled from 'styled-components'

export const LoadingBox = styled.div`
  height: 300px;
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
