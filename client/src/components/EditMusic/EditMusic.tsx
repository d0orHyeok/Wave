import React, { useCallback, useEffect, useState, useRef } from 'react'
import * as S from './EditMusic.style'
import * as mmb from 'music-metadata-browser'
import { ICommonTagsResult } from 'music-metadata/lib/type'
import axios from 'axios'
import EditHead from './EditHead/EditHead'
import EditContent, { IEditContentHandle } from './EditContent/EditContent'

interface EditMusicProps {
  files?: FileList
}

export interface MetaData extends ICommonTagsResult {
  duration?: number
}

const EditMusic = ({ files }: EditMusicProps) => {
  const editContentRef = useRef<IEditContentHandle>(null)

  const [musicMetadata, setMusicMetadata] = useState<MetaData | undefined>()

  const uploadFile = useCallback(() => {
    if (!files) {
      return
    }

    const formData = new FormData()
    formData.append('file', files[0])

    axios
      .post('/api/music/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      .then((response) => {
        console.log(response)
      })
      .catch((error) => console.log(error))
  }, [files])

  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      // 표준에 따라 기본 동작 방지
      event.preventDefault()
      // Chrome에서는 returnValue 설정이 필요함
      event.returnValue = ''
    }
    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload)
    }
  }, [])

  useEffect(() => {
    if (files?.length) {
      mmb
        .parseBlob(files[0], {
          duration: true,
        })
        .then((metadata) => {
          const newMetadata = {
            ...metadata.common,
            duration: metadata.format.duration,
          }
          setMusicMetadata(newMetadata)
        })
        .catch((err) => console.log(err))
    }
  }, [files])

  return (
    <>
      <S.Container>
        <EditHead files={files} />
        <S.EditMain className="editMain">
          <EditContent ref={editContentRef} metadata={musicMetadata} />
          <div>
            <button>Cancel</button>
            <button onClick={uploadFile}>Save</button>
          </div>
        </S.EditMain>
      </S.Container>
    </>
  )
}

export default EditMusic
