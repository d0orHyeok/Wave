import React, {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
} from 'react'
import { IMusicMetadata } from '../EditMusic'
import * as S from './EditMetadata.style'

export interface IEditMetadataHandler {
  getData: () => IEditMetadataValue | void
}

export interface IEditMetadataValue {
  artist?: string
  albumtitle?: string
  albumartist?: string
  composer?: string
  year?: string
  lyrics?: string
}

interface IEditMetadataProps {
  style?: React.CSSProperties
  metadata?: IMusicMetadata
}

const EditMetadata = forwardRef<IEditMetadataHandler, IEditMetadataProps>(
  ({ style, metadata }, ref) => {
    const artistRef = useRef<HTMLInputElement>(null)
    const albumTitleRef = useRef<HTMLInputElement>(null)
    const albumArtistRef = useRef<HTMLInputElement>(null)
    const composerRef = useRef<HTMLInputElement>(null)
    const yearRef = useRef<HTMLInputElement>(null)
    const lyricsRef = useRef<HTMLTextAreaElement>(null)

    const handleChangeYear = useCallback(
      (event: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = event.currentTarget
        let numberValue = value.replaceAll(/[^\d]/g, '')
        if (numberValue.length > 4) {
          numberValue = numberValue.slice(0, 4)
        }

        if (numberValue.length === 4) {
          const currentYear = new Date(Date.now()).getFullYear()
          if (Number(numberValue) > currentYear) {
            numberValue = currentYear.toString()
          } else if (Number(numberValue) < 1900) {
            numberValue = '1900'
          }
        }
        event.currentTarget.value = numberValue
      },
      []
    )

    const handleCheckValidYear = useCallback(() => {
      if (yearRef.current) {
        const { value } = yearRef.current

        const currentYear = new Date(Date.now()).getFullYear()

        if (
          value.length !== 4 ||
          Number(value) < 1900 ||
          Number(value) > currentYear
        ) {
          yearRef.current.focus()
          return alert('Year must be between 1900 and ' + currentYear)
        }
      }
    }, [])

    useImperativeHandle(
      ref,
      () => ({
        getData: () => {
          const artist = !artistRef.current?.value
            ? undefined
            : artistRef.current.value
          const albumtitle = !albumTitleRef.current?.value
            ? undefined
            : albumTitleRef.current.value
          const albumartist = !albumArtistRef.current?.value
            ? undefined
            : albumArtistRef.current.value
          const composer = !composerRef.current?.value
            ? undefined
            : composerRef.current.value
          const year = !yearRef.current?.value
            ? undefined
            : yearRef.current.value
          const lyrics = !lyricsRef.current?.value
            ? undefined
            : lyricsRef.current.value

          year && handleCheckValidYear()

          const data = {
            artist,
            albumtitle,
            albumartist,
            composer,
            year,
            lyrics,
          }

          return data
        },
      }),
      [handleCheckValidYear]
    )

    useEffect(() => {
      if (metadata) {
        const { artist, album, albumartist, composer, year, lyrics } = metadata

        if (artistRef.current && artist) {
          artistRef.current.value = artist
        }
        if (albumTitleRef.current && album) {
          albumTitleRef.current.value = album
        }
        if (albumArtistRef.current && albumartist) {
          albumArtistRef.current.value = albumartist
        }
        if (composerRef.current && composer) {
          composerRef.current.value = composer.join()
        }
        if (yearRef.current && year) {
          yearRef.current.value = year.toString()
        }
        if (lyricsRef.current && lyrics) {
          lyricsRef.current.value = lyrics.join()
        }
      }
    }, [metadata])

    return (
      <div style={style}>
        <S.Container onSubmit={(e) => e.preventDefault()}>
          <S.EditInputBox>
            <label className="label" htmlFor="artist">
              Artist
            </label>
            <input id="artist" type="text" ref={artistRef} maxLength={30} />
          </S.EditInputBox>
          <S.EditInputBox>
            <label className="label" htmlFor="albumtitle">
              Album Title
            </label>
            <input
              id="albumtitle"
              type="text"
              ref={albumTitleRef}
              maxLength={30}
            />
          </S.EditInputBox>
          <S.EditInputBox>
            <label className="label" htmlFor="albumartist">
              Album Artist
            </label>
            <input
              id="albumartist"
              type="text"
              ref={albumArtistRef}
              maxLength={30}
            />
          </S.EditInputBox>
          <S.EditInputBox>
            <label className="label" htmlFor="composer">
              Composer
            </label>
            <input id="composer" type="text" ref={composerRef} maxLength={30} />
          </S.EditInputBox>
          <S.EditInputBox>
            <label className="label" htmlFor="year">
              Year
            </label>
            <input
              id="year"
              type="text"
              ref={yearRef}
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
              ref={lyricsRef}
            ></textarea>
          </S.EditInputBox>
        </S.Container>
      </div>
    )
  }
)

EditMetadata.displayName = 'EditMetadata'

export default EditMetadata
