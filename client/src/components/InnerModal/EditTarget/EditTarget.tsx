import ExtractMusicNav from '@components/ExtractMusic/ExtractMusicNav/ExtractMusicNav'
import MusicBasicInfo, {
  IMusicBasicInfoHandler,
  TypeOnChnageDataKey,
} from '@components/ExtractMusic/MusicBasicInfo/MusicBasicInfo'
import MusicMetadata, {
  IMusicMetadataHandler,
} from '@components/ExtractMusic/MusicMetadata/MusicMetadata'
import { IMusic, IPlaylist } from '@redux/features/player/palyerSlice.interface'
import React, { useState, useCallback, useEffect, useRef } from 'react'
import * as S from './EditTarget.style'
import * as mmb from 'music-metadata-browser'
import Loading from '@components/Loading/Loading'
import { IMusicMetadata } from '@components/ExtractMusic/extractMetadata.types'
import Button, { PrimaryButton } from '@components/Common/Button'
import lodash from 'lodash'

interface EditTargetProps {
  target: IMusic | IPlaylist
  onClose: (any: any) => void
}

const EditTarget = ({ target, onClose }: EditTargetProps) => {
  const musicBasicInfoRef = useRef<IMusicBasicInfoHandler>(null)
  const musiMetadataRef = useRef<IMusicMetadataHandler>(null)

  const [loading, setLoading] = useState(true)
  const [navIndex, setNavIndex] = useState(0)
  const [navItems, setNavItems] = useState<string[]>([])
  const [metadata, setMetadata] = useState<IMusicMetadata | null>()
  const [changed, setChanged] = useState(false)
  const [originData, setOriginData] = useState(target)

  const handleChangeMusicData = useCallback(
    (key: TypeOnChnageDataKey, value: any) => {
      if (!('title' in target)) {
        return
      }

      const changedValue = key === 'cover' && !value ? target.cover : value
      setOriginData((prevState) => {
        return { ...prevState, [key]: changedValue }
      })
    },
    [target]
  )

  const checkChanged = useCallback(() => {
    if ('title' in target) {
      const isChanged = !lodash.isEqual(originData, target)
      setChanged(isChanged)
    }
  }, [originData, target])

  const setNavItem = useCallback(async () => {
    setNavIndex(0)
    setLoading(true)

    if ('title' in target) {
      setNavItems(['Basic Info', 'Metadata'])

      try {
        const md = await mmb.fetchFromUrl(target.link, { duration: true })
        const newMetadata = {
          ...md.common,
          duration: md.format.duration,
          title: target.title,
          permalink: target.permalink,
          status: target.status,
          tags: target.tags,
        }
        setMetadata(newMetadata)
      } catch (error) {
        console.error(error)
      }
    } else {
      setNavItems(['Basic Info', 'Tracks'])
    }

    setLoading(false)
  }, [target])

  useEffect(() => {
    setNavItem()
  }, [setNavItem])

  useEffect(() => {
    checkChanged()
  }, [checkChanged])

  return (
    <S.Wrapper>
      <S.Container>
        {loading && (
          <S.LoadingBox>
            <Loading />
          </S.LoadingBox>
        )}
        <ExtractMusicNav
          navItems={navItems}
          navIndex={navIndex}
          handleClickNav={setNavIndex}
        />
        {'title' in target ? (
          <>
            {navIndex === 0 ? (
              <MusicBasicInfo
                ref={musicBasicInfoRef}
                metadata={metadata}
                onChangeData={handleChangeMusicData}
              />
            ) : (
              <MusicMetadata ref={musiMetadataRef} metadata={metadata} />
            )}
          </>
        ) : (
          <></>
        )}
        <S.Buttons>
          <Button className="buttons-btn cancel" onClick={onClose}>
            Cancel
          </Button>
          <PrimaryButton className={`buttons-btn save ${!changed && 'block'}`}>
            Save Changes
          </PrimaryButton>
        </S.Buttons>
      </S.Container>
    </S.Wrapper>
  )
}

export default EditTarget
