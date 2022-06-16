import React, {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
} from 'react'
import { IMusicMetadata } from '../extractMetadata.types'
import * as S from './MusicMetadata.style'

export interface IMusicMetadataHandler {
  getData: () => IMusicMetadataValue | void
}

export interface IMusicMetadataValue {
  artist?: string
  album?: string
  albumartist?: string
  composer?: string
  year?: string
  lyrics?: string
}

export type OnChangeMetadataKey =
  | 'album'
  | 'artist'
  | 'albumartist'
  | 'composer'
  | 'year'
  | 'lyrics'
  | string

interface IMusicMetadataProps {
  metadata?: IMusicMetadata | null
  onChangeData?: (key: OnChangeMetadataKey, value: any) => void
}

interface Props
  extends IMusicMetadataProps,
    React.HTMLAttributes<HTMLDivElement> {}

const MusicMetadata = forwardRef<IMusicMetadataHandler, Props>(
  ({ metadata, onChangeData, ...props }, ref) => {
    const artistRef = useRef<HTMLInputElement>(null)
    const albumTitleRef = useRef<HTMLInputElement>(null)
    const albumArtistRef = useRef<HTMLInputElement>(null)
    const composerRef = useRef<HTMLInputElement>(null)
    const yearRef = useRef<HTMLInputElement>(null)
    const lyricsRef = useRef<HTMLTextAreaElement>(null)

    useImperativeHandle(
      ref,
      () => ({
        getData: () => {
          const artist = artistRef.current?.value
          const album = albumTitleRef.current?.value
          const albumartist = albumArtistRef.current?.value
          const composer = composerRef.current?.value
          const year = yearRef.current?.value
          const lyrics = lyricsRef.current?.value

          const data = {
            artist,
            album,
            albumartist,
            composer,
            year,
            lyrics,
          }

          return data
        },
      }),
      []
    )

    const handleChangeInput = useCallback(
      (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { id, value } = event.currentTarget
        onChangeData && onChangeData(id, value)
      },
      [onChangeData]
    )

    const handleChangeYear = useCallback(
      (event: React.ChangeEvent<HTMLInputElement>) => {
        handleChangeInput(event)
        const { value } = event.currentTarget

        event.currentTarget.value = value.replaceAll(/[^\d]/g, '')
      },
      [handleChangeInput]
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
      <div {...props}>
        <S.Container onSubmit={(e) => e.preventDefault()}>
          <S.EditInputBox>
            <label className="label" htmlFor="artist">
              Artist
            </label>
            <input
              id="artist"
              type="text"
              ref={artistRef}
              maxLength={30}
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
              ref={albumTitleRef}
              maxLength={30}
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
              ref={albumArtistRef}
              maxLength={30}
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
              ref={composerRef}
              maxLength={30}
              onChange={handleChangeInput}
            />
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
