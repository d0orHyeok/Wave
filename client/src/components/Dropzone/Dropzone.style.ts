import { PrimaryButton } from '@components/Common/Button'
import styled from 'styled-components'

export const DropzoneRoot = styled.div`
  display: inline-block;
  width: 300px;
  height: 300px;
  font-family: sans-serif;
  border: 1px solid ${({ theme }) => theme.colors.border1};
  background-color: ${({ theme }) => theme.colors.bgColor};
`

export const DropzonePaper = styled.div<{ dragging: boolean }>`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: ${({ theme, dragging }) =>
    dragging ? theme.colors.bgColorRGBA(0.03) : 'none'};

  & .dropzone-paper-content {
    margin-bottom: 12px;
  }
`

export const FileBrowser = styled(PrimaryButton)`
  padding: 10px;
  border-radius: 4px;

  &,
  &:hover {
    border: none;
  }
`
