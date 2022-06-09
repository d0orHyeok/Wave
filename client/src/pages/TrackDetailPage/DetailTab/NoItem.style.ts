import styled from 'styled-components'

const NoItem = styled.div`
  padding: 10vh 0;
  text-align: center;
  font-size: 20px;
  line-height: 30px;
  color: ${({ theme }) => theme.colors.bgTextRGBA(0.6)};
`

export default NoItem
