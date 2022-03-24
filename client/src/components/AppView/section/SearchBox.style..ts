import styled from 'styled-components'

export const Wrapper = styled.div<{ open: boolean }>`
  max-width: 450px;
  width: 100%;
  display: inline-block;
  background-color: ${({ theme }) => theme.colors.bgColor};
  transition: ease all 0.3s;

  ${({ theme }) => theme.device.tablet} {
    max-width: 700px;
    width: ${({ open }) => !open && '40px'};
  }
`

export const Container = styled.div<{ active: boolean; open: boolean }>`
  display: inline-flex;
  align-items: center;
  width: 100%;
  height: 40px;
  border-radius: 20px;
  padding: ${({ active }) => (active ? 0 : '0 1px')};
  color: ${({ theme, active }) =>
    active ? theme.colors.bgText : theme.colors.bgTextRGBA('0.38')};
  border: ${({ theme, active }) =>
    !active ? 'none' : `0.5px solid ${theme.colors.border1}`};
  background-color: ${({ theme }) => theme.colors.bgColorRGBA('0.06')};
  transition: color ease 0.3s;

  & .searchBtn svg,
  & .cancelBtn svg {
    min-width: 20px;
    width: 20px;
    height: 20px;
  }
  & .searchBtn,
  & .cancelBtn {
    min-width: 38px;
    width: 38px;
    height: 38px;
    border-radius: 19px;
    border: none;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    background-color: rgba(0, 0, 0, 0);
  }
  & .searchBtn:hover,
  & .cancelBtn:hover {
    background-color: ${({ theme }) => theme.colors.bgColorRGBA('0.12')};
  }

  & .search-input {
    width: 100%;
    color: inherit;
    border: none;
    margin: 0 0.5rem;
    background-color: rgba(0, 0, 0, 0);
    padding: 0;
    font-size: 1rem;
    height: 24px;
    caret-color: ${({ theme }) => theme.colors.secondaryColor};
  }
  & .search-input:focus {
    outline: none;
  }
  & .search-input::placeholder {
    color: ${({ theme }) => theme.colors.bgTextRGBA('0.38')};
  }

  ${({ theme }) => theme.device.tablet} {
    & .search-input,
    & .cancelBtn {
      display: ${({ open }) => !open && 'none'};
    }
  }
`
