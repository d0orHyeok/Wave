import styled from 'styled-components'
import { EditInputBox as InputBox } from '../EditBasicInfo/EditBasicInfo.style'

export const Container = styled.form`
  padding: 1rem 0;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
`

export const EditInputBox = styled(InputBox)`
  width: 250px;
  padding: 0 10px;
`
