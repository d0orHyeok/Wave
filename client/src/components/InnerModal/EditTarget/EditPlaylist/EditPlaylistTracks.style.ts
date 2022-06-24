import styled from 'styled-components'

export const Container = styled.div`
  padding: 20px 0;
  font-size: 14px;
`

export const TrackItem = styled.li`
  display: flex;
  align-items: center;
  padding: 10px;
  border-radius: 3px;
  cursor: move !important;

  &:not(:last-child) {
    border-bottom: 1px solid ${({ theme }) => theme.colors.border1};
  }

  &:hover {
    background-color: ${({ theme }) => theme.colors.bgColorRGBA(0.1)};
  }

  & .item-shrink {
    flex-shrink: 0;
  }

  & .item-imageBox {
    width: 30px;
    height: 30px;
    margin-right: 15px;

    & .img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  & .item-title {
    margin-right: auto;
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  & .item-button {
    margin-left: 10px;
    padding: 0;
    width: 20px;
    height: 20px;
    font-size: 16px;
    line-height: 16px;
    border: none;
    color: ${({ theme }) => theme.colors.bgTextRGBA(0.6)};
    background-color: rgba(0, 0, 0, 0);
  }
`
