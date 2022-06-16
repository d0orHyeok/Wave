import React, { useCallback } from 'react'
import styled from 'styled-components'

interface EditHeadProps {
  files?: FileList
}

const Head = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  border: 1px solid ${({ theme }) => theme.colors.border1};
  height: 50px;
  padding: 1rem;
  border-radius: 4px;
  background-color: ${({ theme }) => theme.colors.bgColorRGBA(0.03)};
  margin-bottom: 1rem;

  & .editHead-filename {
    flex-shrink: 1;
    font-size: 0.9rem;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;

    ${({ theme }) => theme.device.tablet} {
      font-size: 0.8rem;
    }
  }

  & .editHead-fileBrowser {
    flex-shrink: 0;
    background-color: ${({ theme }) => theme.colors.bgColor};
    height: 30px;
    border-radius: 4px;
    transition: 0.2s ease border-color;

    &:hover {
      border-color: ${({ theme }) => theme.colors.border2};
    }
  }
`

const EditHead = ({ files }: EditHeadProps) => {
  const openFileBrowser = useCallback(() => {
    const inputEl = document
      .getElementsByTagName('input')
      .namedItem('music-upload')
    if (inputEl) {
      inputEl.click()
    }
  }, [])

  return (
    <Head className="editHead">
      <h1 className="editHead-filename">
        {files ? files[0].name : 'Please upload your music'}
      </h1>
      <button className="editHead-fileBrowser" onClick={openFileBrowser}>
        {files ? 'Replace' : 'Upload'} file
      </button>
    </Head>
  )
}

export default EditHead
