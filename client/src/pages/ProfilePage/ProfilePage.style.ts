import styled from 'styled-components'

export const Wrapper = styled.div`
  min-height: 100%;
  max-width: 1200px;
  margin: auto;

  & .profileNav {
    margin: 0 30px;
  }
`

export const Container = styled.div`
  padding: 10px 30px;
  display: flex;
  min-width: 900px;
  box-sizing: border-box;

  & > * {
    min-width: 0;
  }

  & .profile-main {
    flex-grow: 1;
    border-right: 1px solid ${({ theme }) => theme.colors.border1};
    margin-right: 20px;
    padding-right: 20px;
  }

  & .profile-side {
    width: 300px;
    flex-shrink: 0;
  }
`
