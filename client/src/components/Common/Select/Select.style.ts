import styled, { css } from 'styled-components'

export const Wrapper = styled.div`
  font-size: inherit;
  position: relative;
  height: 30px;
  width: 220px;
`

export const SelectButton = styled.div`
  ${({ theme }) => {
    const { colors: t } = theme
    return css`
      border: 1px solid ${t.border1};
      color: ${t.bgText};
      width: 100%;
      height: 30px;
      border-radius: 3px;
      transition: 0.1s ease all;
      background-color: ${t.bgColor};
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;

      &:active {
        box-shadow: 0 0 2px 3px ${t.border1};
      }

      &:hover {
        border-color: ${t.border2};
      }

      & .button-aria-label {
        padding: 0 8px;
        line-height: 28px;
      }

      & .button-aria-icon {
        margin: 0 8px;
        float: right;
        line-height: 30px;
        color: ${t.border2};

        &::after {
          content: '';
          display: block;
          clear: both;
        }
      }
    `
  }}
`

export const Container = styled.div<{ open?: boolean }>`
  ${({ theme, open }) => {
    const { colors: t } = theme
    return css`
      position: absolute;
      border-radius: 3px;
      background-color: ${t.bgColor};
      width: 100%;
      min-height: 30px;
      max-height: 300px;
      z-index: 10;
      box-shadow: 0 1px 8px ${t.border1};
      overflow-y: auto;
      display: ${open ? 'block' : 'none'};

      &::-webkit-scrollbar {
        width: 5px;
        border-radius: 2.5px;
        background-color: ${t.bgColorRGBA('0.06')};
      }
      &::-webkit-scrollbar-thumb {
        border-radius: 2.5px;
        background-color: ${t.bgColorRGBA('0.2')};
      }
    `
  }}
`

export const Content = styled.ul`
  padding: 10px 0;
`

export const StyledLi = styled.li`
  ${({ theme }) => {
    const { colors: t } = theme
    return css`
      cursor: pointer;
      height: 28px;
      line-height: 28px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;

      &:hover,
      &.select {
        color: ${t.primaryColor};
      }
    `
  }}
`
