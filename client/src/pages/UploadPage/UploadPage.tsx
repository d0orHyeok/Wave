import React, { useCallback, useState } from 'react'
import EditMusic from '@components/EditMusic/EditMusic'
import * as S from './UploadPage.style'

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
      <S.Wrapper
        style={{ alignItems: musicFiles?.length ? 'flex-start' : 'center' }}
      >
        <S.StyledDropzone
          hidden={musicFiles?.length ? true : false}
          onChangeFiles={handleChangeFiles}
        />
        {musicFiles?.length && (
          <EditMusic files={musicFiles} resetFiles={handleResetFiles} />
        )}
      </S.Wrapper>
    </>
  )
}

export default React.memo(UploadPage)
