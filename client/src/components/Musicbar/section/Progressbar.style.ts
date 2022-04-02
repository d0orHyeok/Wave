import styled from 'styled-components'

export const ProgressBox = styled.div`
  cursor: pointer;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 16px;

  &::before {
    position: absolute;
    content: '';
    top: 0;
    left: 0;
    width: 100%;
    background-color: ${({ theme }) => theme.colors.bgColorRGBA(0.16)};
  }

  & .progress {
    position: relative;
    z-index: 10001;
    background-color: ${({ theme }) => theme.colors.primaryColor};
  }

  &::before,
  & .progress {
    height: 3px;
    transition: 0.1s ease all;
  }

  &:hover {
    &::before,
    & .progress {
      height: 100%;
    }

    & ~ .progress-backdrop {
      display: block;
    }

    & .hoverTime,
    & .progress::after {
      cursor: default;
      position: absolute;
      bottom: 0;
      font-size: 0.8em;
      transform: translateY(1.5em);
    }

    & .progress::after {
      right: 0;
      content: attr(data-current);
      color: ${({ theme }) => theme.colors.primaryColor};
    }
  }
`

export const ProgressBackDrop = styled.div`
  position: absolute;
  top: 16px;
  left: 0;
  width: 100%;
  height: 100px;
  background-color: rgba(0, 0, 0, 0.33);
  cursor: default;
  transition: 0.1s ease all;
  display: none;
`

export const DurationBox = styled.div`
  width: 70px;
  text-align: center;
  font-size: 0.75em;
  margin-right: 1em;
  color: ${({ theme }) => theme.colors.bgTextRGBA(0.6)};
  & .currentTime {
    &:after {
      content: '/';
      margin: 0 0.5em;
    }
  }
  & .duration {
    color: ${({ theme }) => theme.colors.bgTextRGBA(0.86)};
  }

  ${({ theme }) => theme.device.tablet} {
    display: none;
  }
`
