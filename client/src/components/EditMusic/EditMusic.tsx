import React, { useCallback, useEffect, useState, useRef } from 'react'
import * as S from './EditMusic.style'
import * as mmb from 'music-metadata-browser'
import { ICommonTagsResult } from 'music-metadata/lib/type'
import Axios from '@api/Axios'
import EditHead from './EditHead/EditHead'
import EditBasicInfo, {
  IEditBasicInfoHandler,
} from './EditBasicInfo/EditBasicInfo'
import EditMetadata, { IEditMetadataHandler } from './EditMetadata/EditMetadata'
import { useAlert } from '@redux/context/alertProvider'
import { useNavigate } from 'react-router-dom'

interface EditMusicProps {
  files?: FileList
  resetFiles: () => void
}

export interface IMusicMetadata extends ICommonTagsResult {
  duration?: number
}

const EditMusic = ({ files, resetFiles }: EditMusicProps) => {
  const openAlert = useAlert()
  const navigate = useNavigate()

  const editNavItems = ['Basic Info', 'Metadata']

  const editBasicInfoRef = useRef<IEditBasicInfoHandler>(null)
  const editMetadataRef = useRef<IEditMetadataHandler>(null)

  const [editNavIndex, setEditNavIndex] = useState(0)
  const [musicMetadata, setMusicMetadata] = useState<IMusicMetadata>()

  const uploadFile = () => {
    if (!files || !musicMetadata) {
      // 파일과 메타데이터가 없다면 재업로드 요청
      return resetFiles()
    }

    const basicInfoData = editBasicInfoRef.current?.getData()
    const metadataData = editMetadataRef.current?.getData()

    if (!(basicInfoData && metadataData)) {
      // 데이터를 가져오지 못한경우 업로드 취소
      setEditNavIndex(0)
      return
    }
    openAlert('업로드를 시작합니다.', { severity: 'info' })

    const { cover, ...musicData } = basicInfoData
    const { title, genre, description } = musicData
    const data = {
      ...musicData,
      duration: musicMetadata.duration,
      metadata: { title, genre, description, ...metadataData },
    }

    // 음악파일, 커버이미지, 음악데이터 저장
    const formData = new FormData()
    formData.append('music', files[0])
    if (cover) {
      formData.append('cover', cover)
    }
    formData.append(
      'data',
      new Blob([JSON.stringify(data)], { type: 'application/json' })
    )

    // 서버에 업로드 요청
    Axios.post('/api/music/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
      .then(() => {
        openAlert('업로드에 성공하였습니다.')
        if (window.confirm('계속해서 업로드 하시겠습니까?')) {
          resetFiles()
        } else {
          navigate('/')
        }
      })
      .catch(() => openAlert('업로드에 실패하였습니다', { severity: 'error' }))
  }

  const handleClickCancel = useCallback(() => {
    if (
      confirm(
        'Are you sure you want to stop your upload? Any unsaved changes will be lost.'
      )
    ) {
      setEditNavIndex(0)
      setMusicMetadata(undefined)
      resetFiles()
    }
  }, [resetFiles])

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
      <S.Container style={{ display: files ? 'block' : 'none' }}>
        <EditHead files={files} />
        <S.EditMain className="editMain">
          <S.EditNav className="editNav">
            {editNavItems.map((item, index) => (
              <S.EditNavItem
                key={item}
                className="editNav-item"
                onClick={() => setEditNavIndex(index)}
                select={editNavIndex === index}
              >
                {item}
              </S.EditNavItem>
            ))}
          </S.EditNav>
          <EditBasicInfo
            metadata={musicMetadata}
            ref={editBasicInfoRef}
            style={{ display: editNavIndex === 0 ? 'flex' : 'none' }}
          />
          <EditMetadata
            metadata={musicMetadata}
            ref={editMetadataRef}
            style={{ display: editNavIndex === 1 ? 'block' : 'none' }}
          />
          <div>
            <button onClick={handleClickCancel}>Cancel</button>
            <button onClick={uploadFile}>Save</button>
          </div>
        </S.EditMain>
      </S.Container>
    </>
  )
}

export default EditMusic
