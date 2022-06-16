import React, { useCallback, useState } from 'react'
import * as S from './UploadPage.style'
import { Helmet } from 'react-helmet'
import UploadMusic from './UploadMusic'

const UploadPage = () => {
  const [musicFiles, setMusicFiles] = useState<FileList>()

  const handleChangeFiles = useCallback((files: FileList) => {
    if (files.length) {
      setMusicFiles(files)
    }
  }, [])

  const handleResetFiles = useCallback(() => {
    setMusicFiles(undefined)
  }, [])

  return (
    <>
      <Helmet>
        <title>Upload your music | Wave</title>
      </Helmet>
      <S.Wrapper
        style={{ alignItems: musicFiles?.length ? 'flex-start' : 'center' }}
      >
        <S.StyledDropzone
          hidden={musicFiles?.length ? true : false}
          onChangeFiles={handleChangeFiles}
        />
        <UploadMusic files={musicFiles} resetFiles={handleResetFiles} />
      </S.Wrapper>
    </>
  )
}

export default React.memo(UploadPage)
