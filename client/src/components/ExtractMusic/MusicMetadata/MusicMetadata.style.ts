import styled from 'styled-components'
import { EditInputBox as InputBox } from '../MusicBasicInfo/MusicBasicInfo.style'

export const Container = styled.form`
  padding: 20px 0;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
`

export const EditInputBox = styled(InputBox)`
  width: 50%;
  min-width: 200px;
  padding: 0 10px;
`
