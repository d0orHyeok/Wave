import styled from 'styled-components'

export const Container = styled.div`
  margin: 0 auto;
  max-width: 900px;
  padding: 0 50px;
  min-width: 300px;
  width: 100%;
`

export const EditMain = styled.div`
  box-shadow: 0px 0px 3px 1px ${({ theme }) => theme.colors.border1};
  padding: 1rem;
`
