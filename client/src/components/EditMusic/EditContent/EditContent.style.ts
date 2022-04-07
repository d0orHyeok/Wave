import styled from 'styled-components'

export const EditNav = styled.div`
  display: flex;
  align-items: center;
  border-bottom: 1px solid ${({ theme }) => theme.colors.bgColorRGBA(0.03)};
`

export const EditNavItem = styled.span<{ select?: boolean }>`
  padding: 0.5rem 0 1rem 0;
  font-size: 1.3rem;
  position: relative;
  margin-right: 1rem;
  cursor: pointer;
  color: ${({ theme, select }) =>
    select ? theme.colors.primaryColor : theme.colors.bgText};

  &:last-child {
    margin-right: 0;
  }

  &::after {
    content: '';
    position: absolute;
    left: 0;
    bottom: 0;
    width: 100%;
    height: 2px;
    background-color: ${({ theme, select }) =>
      select ? theme.colors.primaryColor : theme.colors.bgText};
    display: ${({ select }) => (select ? 'block' : 'none')};
  }

  &:hover {
    &::after {
      display: block;
    }
  }

  ${({ theme }) => theme.device.tablet} {
    font-size: 1.1rem;
  }
`

const EditContent = styled.div`
  padding: 1rem 0;
`

export const EditBasicInfo = styled(EditContent)`
  display: flex;

  ${({ theme }) => theme.device.tablet} {
    flex-direction: column;
  }

  & .imageBox {
    position: relative;
    flex-shrink: 0;
    width: 256px;
    height: 256px;
    margin-right: 1rem;

    & label {
      display: inline-flex;
      align-items: center;
      position: absolute;
      bottom: 32px;
      left: 50%;
      transform: translateX(-50%);
      cursor: pointer;
      background-color: rgba(255, 255, 255, 0.66);
      color: black;
      padding: 3px 6px;
      font-size: 12px;
      border-radius: 4px;
      border: 1px solid lightgray;

      & svg {
        width: 16px;
        height: 16px;
      }
    }

    & img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    ${({ theme }) => theme.device.tablet} {
      align-self: center;
      margin-right: 0;
      margin: 1rem;
    }
  }
`

export const EditBasicInfoForm = styled.form`
  flex-shrink: 1;
  width: 100%;
`

export const EditInputBox = styled.div`
  margin-bottom: 1rem;
  font-size: 0.9rem;

  &:last-child {
    margin-bottom: 0;
  }

  & .label {
    display: block;
    margin-bottom: 0.5rem;

    & .require {
      display: inline;
      color: ${({ theme }) => theme.colors.errorColor};
    }
  }

  & input,
  & textarea {
    border: 1px solid ${({ theme }) => theme.colors.border1};
    border-radius: 4px;
    background-color: inherit;
    color: ${({ theme }) => theme.colors.bgTextRGBA(0.6)};
    width: 100%;
    font-size: 0.85rem;
    padding: 4px 8px;

    &:hover,
    &:focus {
      outline: none;
      color: ${({ theme }) => theme.colors.bgTextRGBA(0.86)};
      border-color: ${({ theme }) => theme.colors.border2};
    }
  }
  & textarea {
    resize: vertical;
  }

  & .inputwrap {
    display: flex;
    height: 1.5rem;
    color: ${({ theme }) => theme.colors.bgTextRGBA(0.6)};

    & input {
      padding: 4px 0;
      border: none;
      &:focus {
        border: 1px solid ${({ theme }) => theme.colors.border2};
      }
    }

    & input:focus + .permalinkBtn {
      display: none;
    }

    & .permalinkBtn {
      border: none;
      & svg {
        width: 1rem;
        height: 1rem;
      }
      &:hover {
        color: ${({ theme }) => theme.colors.bgTextRGBA(0.86)};
      }
    }
  }
`