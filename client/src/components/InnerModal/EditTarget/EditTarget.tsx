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
import { changeMusicCover, updateMusicData } from '@api/musicApi'
import EditPlaylistData, {
  TypeOnChangeDataKey as PlaylistKey,
} from './EditPlaylist/EditPlaylistData'
import EditPlaylistTracks from './EditPlaylist/EditPlaylistTracks'
import * as ModalStyle from '../common.style'
import {
  changePlaylistImage,
  changePlaylistMusics,
  updatePlaylistData,
} from '@api/playlistApi'

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
  image?: string | File
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
  const [trackIndexes, setTrackIndexes] = useState<number[] | null>(null)

  const updateTrack = useCallback(async () => {
    // 음악정보를 변경한다.
    try {
      const { cover, ...body } = musicEditData
      const response = await updateMusicData(target.id, body)
      const coverReq =
        cover && typeof cover !== 'string'
          ? await changeMusicCover(target.id, cover)
          : null
      const updatedMusic = coverReq ? coverReq.data : response.data
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
    // 플레이리스트 정보를 변경한다.
    if ('name' in target) {
      try {
        const { image, ...body } = playlistEditData
        const response = await updatePlaylistData(target.id, body)
        const imageReq =
          image && typeof image !== 'string'
            ? await changePlaylistImage(target.id, image)
            : null
        const updatedPlaylist = imageReq ? imageReq.data : response.data
        setTarget && setTarget(updatedPlaylist)
        if (trackIndexes) {
          const musicIds = trackIndexes.map((index) => target.musics[index].id)
          const res = await changePlaylistMusics(target.id, musicIds)
          const musics = res.data
          setTarget((prevState: any) => {
            return !updatedPlaylist
              ? { ...prevState, musics }
              : { ...updatedPlaylist, musics }
          })
        }

        openAlert('Playlist data has been changed', { severity: 'success' })
      } catch (error: any) {
        console.error(error.response || error)
        openAlert('Fail to update playlist', { severity: 'error' })
      } finally {
        onClose()
      }
    }
  }, [onClose, openAlert, playlistEditData, setTarget, target, trackIndexes])

  const handleClickSave = useCallback(async () => {
    if (!changed) {
      return
    }
    setLoading(true)
    if ('title' in target) {
      updateTrack()
    } else {
      updatePlaylist()
    }
    setLoading(false)
  }, [changed, target, updateTrack, updatePlaylist])

  const handleChangeMusicData = useCallback(
    // 음악정보가 변경되었음을 확인하면 변경된 정보를 저장하고 같다면 해당 항목을 삭제한다.
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
    // 플레이리스트 정보가 변경되었음을 확인하면 변경된 정보를 저장하고 같다면 해당 항목을 삭제한다.
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

  const handleChangeOrder = useCallback((indexes: number[] | null) => {
    setTrackIndexes(indexes)
  }, [])

  const checkChanged = useCallback(() => {
    // 변경된 정보가 있는지를 확인
    const isChanged =
      Boolean(Object.keys(musicEditData).length) ||
      Boolean(Object.keys(playlistEditData).length) ||
      Boolean(trackIndexes)
    setChanged(isChanged)
  }, [musicEditData, playlistEditData, trackIndexes])

  const handleOnMount = useCallback(async () => {
    // 페이지 접속시 초기화
    setNavIndex(0)
    setLoading(true)
    setTrackIndexes(null)

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
        <ModalStyle.ModalTitle>
          <ExtractMusicNav
            navItems={navItems}
            navIndex={navIndex}
            handleClickNav={setNavIndex}
          />
        </ModalStyle.ModalTitle>

        <ModalStyle.ModalContent
          style={{
            position: 'relative',
            overflowY: loading ? 'hidden' : 'auto',
          }}
        >
          {loading && (
            <S.LoadingBox>
              <Loading />
            </S.LoadingBox>
          )}
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
              <EditPlaylistData
                playlist={target}
                onChangeData={handleChangePlaylistData}
                style={{ display: navIndex === 0 ? 'block' : 'none' }}
              />
              <EditPlaylistTracks
                playlist={target}
                onChangeOrder={handleChangeOrder}
                style={{ display: navIndex === 0 ? 'none' : 'block' }}
              />
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
      </ModalStyle.InnerModalContainer>
    </ModalStyle.InnerModalWrapper>
  )
}

export default EditTarget
