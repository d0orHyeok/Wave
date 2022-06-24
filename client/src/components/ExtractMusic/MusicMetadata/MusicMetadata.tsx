import React, {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useLayoutEffect,
  useState,
} from 'react'
import { IExtractMetadata } from '../extractMetadata.types'
import * as S from './MusicMetadata.style'

export interface IMusicMetadataHandler {
  getData: () => IMusicMetadataValue | void
}

export interface IMusicMetadataValue {
  artist?: string
  album?: string
  albumartist?: string
  composer?: string[]
  year?: number
  lyrics?: string[]
}

export type TypeOnChangeMetadataKey =
  | 'album'
  | 'artist'
  | 'albumartist'
  | 'composer'
  | 'year'
  | 'lyrics'

interface IMusicMetadataProps {
  metadata?: IExtractMetadata | null
  onChangeData?: (key: any, value: any) => void
}

interface Props
  extends IMusicMetadataProps,
    React.HTMLAttributes<HTMLDivElement> {}

const MusicMetadata = forwardRef<IMusicMetadataHandler, Props>(
  ({ metadata, onChangeData, ...props }, ref) => {
    const [inputValue, setInputValue] = useState({
      artist: '',
      album: '',
      albumartist: '',
      composer: '',
      year: '',
      lyrics: '',
    })

    useImperativeHandle(
      ref,
      () => ({
        getData: () => {
          const { artist, album, albumartist, composer, year, lyrics } =
            inputValue

          const data = {
            artist,
            album,
            albumartist,
            composer: !composer ? undefined : composer.split(';').slice(0, -1),
            year: year ? Number(year) : undefined,
            lyrics: !lyrics ? undefined : lyrics.split('\n'),
          }

          return data
        },
      }),
      [inputValue]
    )

    const whenSetInputValue = useCallback(
      (key: string, value: any) => {
        setInputValue((prevState) => {
          return { ...prevState, [key]: value }
        })
        if (!onChangeData) {
          return
        }

        if (!value) {
          return onChangeData(key, null)
        }

        switch (key) {
          case 'composer':
            onChangeData(key, value.split(';').slice(0, -1))
            break
          case 'lyrics':
            onChangeData(key, value.split('\n'))
            break
          case 'year':
            onChangeData(key, Number(value))
            break
          default:
            onChangeData(key, value)
        }
      },
      [onChangeData]
    )

    const handleChangeInput = useCallback(
      (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { id, value } = event.currentTarget
        whenSetInputValue(id, value)
      },
      [whenSetInputValue]
    )

    const handleLeaveComposer = useCallback(
      (event: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = event.currentTarget
        const l = value.length
        if (l > 0 && value[l - 1] !== ';') {
          whenSetInputValue('composer', `${value};`)
        }
      },
      [whenSetInputValue]
    )

    const handleChangeYear = useCallback(
      (event: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = event.currentTarget
        const newValue = value.replaceAll(/[^\d]/g, '')
        whenSetInputValue('year', newValue)
      },
      [whenSetInputValue]
    )

    useLayoutEffect(() => {
      if (metadata) {
        const { artist, album, albumartist, composer, year, lyrics } = metadata

        setInputValue({
          artist: artist || '',
          album: album || '',
          albumartist: albumartist || '',
          composer: composer?.length ? `${composer.join(';')};` : '',
          year: year?.toString() || '',
          lyrics: lyrics?.length ? lyrics.join('\n') : '',
        })
      }
    }, [metadata])

    return (
      <div {...props}>
        <S.Container onSubmit={(e) => e.preventDefault()}>
          <S.EditInputBox>
            <label className="label" htmlFor="artist">
              Artist
            </label>
            <input
              id="artist"
              type="text"
              maxLength={30}
              value={inputValue.artist}
              onChange={handleChangeInput}
            />
          </S.EditInputBox>
          <S.EditInputBox>
            <label className="label" htmlFor="album">
              Album Title
            </label>
            <input
              id="album"
              type="text"
              maxLength={30}
              value={inputValue.album}
              onChange={handleChangeInput}
            />
          </S.EditInputBox>
          <S.EditInputBox>
            <label className="label" htmlFor="albumartist">
              Album Artist
            </label>
            <input
              id="albumartist"
              type="text"
              maxLength={30}
              value={inputValue.albumartist}
              onChange={handleChangeInput}
            />
          </S.EditInputBox>
          <S.EditInputBox>
            <label className="label" htmlFor="composer">
              Composer
            </label>
            <input
              id="composer"
              type="text"
              maxLength={30}
              value={inputValue.composer}
              onChange={handleChangeInput}
              onBlur={handleLeaveComposer}
            />
          </S.EditInputBox>
          <S.EditInputBox>
            <label className="label" htmlFor="year">
              Year
            </label>
            <input
              id="year"
              type="text"
              value={inputValue.year}
              onChange={handleChangeYear}
            />
          </S.EditInputBox>
          <S.EditInputBox>
            <label className="label" htmlFor="lyrics">
              Lyrics
            </label>
            <textarea
              name="lyrics"
              id="lyrics"
              rows={6}
              value={inputValue.lyrics}
              onChange={handleChangeInput}
            ></textarea>
          </S.EditInputBox>
        </S.Container>
      </div>
    )
  }
)

MusicMetadata.displayName = 'MusicMetadata'

export default MusicMetadata
