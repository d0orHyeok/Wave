import styled from 'styled-components'
import Dropzone from '@components/Dropzone/Dropzone'

export const Wrapper = styled.div`
  padding: 3rem 0;
  min-height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`

export const StyledDropzone = styled(Dropzone)<{ hidden?: boolean }>`
  width: 100%;
  min-width: 240px;
  max-width: 600px;
  border-style: dotted;
  display: ${({ hidden }) => (hidden ? 'none' : 'flex')};
`
