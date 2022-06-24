import ExtractMusicNav from '@components/ExtractMusic/ExtractMusicNav/ExtractMusicNav'
import MusicBasicInfo, {
  IMusicBasicInfoHandler,
  TypeOnChnageDataKey,
} from '@components/ExtractMusic/MusicBasicInfo/MusicBasicInfo'
import MusicMetadata, {
  TypeOnChangeMetadataKey,
  IMusicMetadataHandler,
} from '@components/ExtractMusic/MusicMetadata/MusicMetadata'
import { IMusic, IPlaylist, TypeStatus } from '@appTypes/types.type.'
import React, {
  useState,
  useCallback,
  useEffect,
  useRef,
  useLayoutEffect,
} from 'react'
import * as S from './EditTarget.style'
import * as mmb from 'music-metadata-browser'
import Loading from '@components/Loading/Loading'
import { IExtractMetadata } from '@components/ExtractMusic/extractMetadata.types'
import Button, { PrimaryButton } from '@components/Common/Button'
import { useAlert } from '@redux/context/alertProvider'
import { updateMusicData } from '@api/musicApi'
import EditPlaylistData, {
  TypeOnChangeDataKey as PlaylistKey,
} from './EditPlaylist/EditPlaylistData'
import EditPlaylistTracks from './EditPlaylist/EditPlaylistTracks'
import * as ModalStyle from '../common.style'
import { updatePlaylistData } from '@api/playlistApi'

interface IMusicEditData {
  title?: string
  permalink?: string
  status?: TypeStatus
  tags?: string[]
  genre?: string[]
  description?: string
  cover?: string | File
  album?: string
  artist?: string
  albumartist?: string
  composer?: string[]
  lyrics?: string[]
  year?: number
}

interface IPlaylistEditData {
  name?: string
  permalink?: string
  status?: TypeStatus
  tags?: string[]
  description?: string
  image?: string
}

interface EditTargetProps {
  target: IMusic | IPlaylist
  setTarget?: any
  onClose: (any?: any) => void
}

const EditTarget = ({ target, setTarget, onClose }: EditTargetProps) => {
  const openAlert = useAlert()

  const musicBasicInfoRef = useRef<IMusicBasicInfoHandler>(null)
  const musiMetadataRef = useRef<IMusicMetadataHandler>(null)

  const [loading, setLoading] = useState(true)
  const [navIndex, setNavIndex] = useState(0)
  const [navItems, setNavItems] = useState<string[]>([]) // 메뉴 탭 아이템
  const [metadata, setMetadata] = useState<IExtractMetadata | null>() // 음악파일의 메타데이터 정보
  const [changed, setChanged] = useState(false)
  const [musicEditData, setMusicEditData] = useState<IMusicEditData>({}) // 변화된 데이터
  const [playlistEditData, setPlaylistEditData] = useState<IPlaylistEditData>(
    {}
  )

  const updateTrack = useCallback(async () => {
    try {
      const response = await updateMusicData(target.id, musicEditData)
      const updatedMusic = response.data
      setTarget && setTarget(updatedMusic)
      openAlert('Track data has been changed', { severity: 'success' })
    } catch (error: any) {
      console.error(error.response || error)
      openAlert('Fail to update track', { severity: 'error' })
    } finally {
      onClose()
    }
  }, [musicEditData, onClose, openAlert, setTarget, target.id])

  const updatePlaylist = useCallback(async () => {
    try {
      const response = await updatePlaylistData(target.id, playlistEditData)
      const updatedPlaylist = response.data
      setTarget && setTarget(updatedPlaylist)
      openAlert('Playlist data has been changed', { severity: 'success' })
    } catch (error: any) {
      console.error(error.response || error)
      openAlert('Fail to update playlist', { severity: 'error' })
    } finally {
      onClose()
    }
  }, [onClose, openAlert, playlistEditData, setTarget, target.id])

  const handleClickSave = useCallback(async () => {
    if (!changed) {
      return
    }
    if ('title' in target) {
      updateTrack()
    } else {
      updatePlaylist()
    }
  }, [changed, target, updateTrack, updatePlaylist])

  const handleChangeMusicData = useCallback(
    (key: TypeOnChnageDataKey | TypeOnChangeMetadataKey, value: any) => {
      if ('title' in target) {
        setMusicEditData((data) => {
          const changedValue = key === 'cover' && !value ? target.cover : value

          if (JSON.stringify(target[key]) !== JSON.stringify(changedValue)) {
            return { ...data, [key]: changedValue }
          } else {
            const newData = { ...data }
            delete newData[key]
            return newData
          }
        })
      }
    },
    [target]
  )

  const handleChangePlaylistData = useCallback(
    (key: PlaylistKey, value: any) => {
      if ('name' in target) {
        setPlaylistEditData((data) => {
          if (JSON.stringify(target[key]) !== JSON.stringify(value)) {
            return { ...data, [key]: value }
          } else {
            const newData = { ...data }
            delete newData[key]
            return newData
          }
        })
      }
    },
    [target]
  )

  const checkChanged = useCallback(() => {
    const isChanged =
      Boolean(Object.keys(musicEditData).length) ||
      Boolean(Object.keys(playlistEditData).length)
    setChanged(isChanged)
  }, [musicEditData, playlistEditData])

  const handleOnMount = useCallback(async () => {
    setNavIndex(0)
    setLoading(true)

    if ('title' in target) {
      setNavItems(['Basic Info', 'Metadata'])

      try {
        const md = await mmb.fetchFromUrl(target.link)
        const { description, ...datas } = target
        const newMetadata = {
          ...md.common,
          ...datas,
          comment: description ? [description] : undefined,
        }
        setMetadata(newMetadata)
      } catch (error) {
        console.error(error)
        alert('Failed to load data')
        return onClose()
      }
    } else {
      setNavItems(['Basic Info', 'Tracks'])
      setMetadata(null)
    }

    setLoading(false)
  }, [target, onClose])

  useLayoutEffect(() => {
    handleOnMount()
  }, [handleOnMount])

  useEffect(() => {
    checkChanged()
  }, [checkChanged])

  return (
    <ModalStyle.InnerModalWrapper>
      <ModalStyle.InnerModalContainer>
        {loading ? (
          <S.LoadingBox>
            <Loading />
          </S.LoadingBox>
        ) : (
          <>
            <ModalStyle.ModalTitle>
              <ExtractMusicNav
                navItems={navItems}
                navIndex={navIndex}
                handleClickNav={setNavIndex}
              />
            </ModalStyle.ModalTitle>

            <ModalStyle.ModalContent>
              {'title' in target ? (
                <>
                  {navIndex === 0 ? (
                    <MusicBasicInfo
                      ref={musicBasicInfoRef}
                      metadata={metadata}
                      onChangeData={handleChangeMusicData}
                    />
                  ) : (
                    <MusicMetadata
                      ref={musiMetadataRef}
                      metadata={metadata}
                      onChangeData={handleChangeMusicData}
                    />
                  )}
                </>
              ) : (
                <>
                  {navIndex === 0 ? (
                    <EditPlaylistData
                      playlist={target}
                      onChangeData={handleChangePlaylistData}
                    />
                  ) : (
                    <EditPlaylistTracks playlist={target} />
                  )}
                </>
              )}
            </ModalStyle.ModalContent>
            <ModalStyle.ModalActions>
              <S.Buttons>
                <Button className="buttons-btn cancel" onClick={onClose}>
                  Cancel
                </Button>
                <PrimaryButton
                  className={`buttons-btn save ${!changed && 'block'}`}
                  onClick={handleClickSave}
                >
                  Save Changes
                </PrimaryButton>
              </S.Buttons>
            </ModalStyle.ModalActions>
          </>
        )}
      </ModalStyle.InnerModalContainer>
    </ModalStyle.InnerModalWrapper>
  )
}

export default EditTarget
