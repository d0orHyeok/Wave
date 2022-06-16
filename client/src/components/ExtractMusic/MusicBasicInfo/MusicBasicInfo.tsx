import React, {
  forwardRef,
  useCallback,
  useEffect,
  useRef,
  useState,
  useImperativeHandle,
} from 'react'
import * as S from './MusicBasicInfo.style'
import { useAppSelector } from '@redux/hook'
import { fileToUint8Array, getCoverUrlFromMetadata } from '@api/functions'
import { MdOutlineEdit } from 'react-icons/md'
import { AiFillCamera } from 'react-icons/ai'
import EmptyMusicCover from '@styles/EmptyImage/EmptyMusicCover.style'
import { IMusicMetadata } from '../extractMetadata.types'

export interface IMusicBasicInfoHandler {
  getData: () => IMusicBasicInfoValue | void
}

export interface IMusicBasicInfoValue {
  title: string
  permalink: string
  genre?: string
  description?: string
  tags?: string[]
  cover?: File
  status: 'PRIVATE' | 'PUBLIC' | string
}

export type TypeOnChnageDataKey =
  | 'title'
  | 'permalink'
  | 'genre'
  | 'description'
  | 'tags'
  | 'cover'
  | 'status'

interface MusicBaiscInfoProps {
  metadata?: IMusicMetadata | null
  onChangeData?: (key: TypeOnChnageDataKey, value: any) => void
}

interface Props
  extends MusicBaiscInfoProps,
    React.HTMLAttributes<HTMLDivElement> {}

const MusicBasicInfo = forwardRef<IMusicBasicInfoHandler, Props>(
  ({ metadata, onChangeData, ...props }, ref) => {
    const titleRef = useRef<HTMLInputElement>(null)
    const permalinkRef = useRef<HTMLInputElement>(null)
    const genreRef = useRef<HTMLInputElement>(null)
    const tagRef = useRef<HTMLInputElement>(null)
    const descriptionRef = useRef<HTMLTextAreaElement>(null)
    const coverInputRef = useRef<HTMLInputElement>(null)

    const userId = useAppSelector((state) => state.user.userData?.id)

    const [status, setStatus] = useState(true)
    const [cover, setCover] = useState<string | null | undefined>(null)
    const [originalCover, setOriginalCover] = useState<{
      file?: File
      url?: string
    }>({})

    useImperativeHandle(
      ref,
      () => ({
        getData: () => {
          const title = titleRef.current?.value
          const permalink = permalinkRef.current?.value
          const tags = tagRef.current?.value.split('#').splice(1)
          const genre = genreRef.current?.value
          const description = descriptionRef.current?.value
          const newCover = !coverInputRef.current?.files
            ? undefined
            : coverInputRef.current.files[0]

          if (!title) {
            titleRef.current?.focus()
            return alert('[Basic Info]\nPlease enter a title')
          }
          if (!permalink) {
            permalinkRef.current?.focus()
            return alert('[Basic Info]\nPlease enter a permalink')
          }

          const data = {
            title,
            permalink: `${permalink}`,
            tags: tags?.length ? tags : undefined,
            genre,
            description,
            cover: newCover || originalCover.file,
            status: status ? 'PUBLIC' : 'PRIVATE',
          }
          return data
        },
      }),
      [originalCover, status]
    )

    const handleChangeCover = useCallback(
      async (event: React.ChangeEvent<HTMLInputElement>) => {
        // 사용자가 앨범 이미지를 등록하면 미리보기 부분에 보여줌
        const { files } = event.currentTarget
        if (files?.length && files[0].type.includes('image/')) {
          const data = await fileToUint8Array(files[0])
          const url = getCoverUrlFromMetadata(data, files[0].type)
          setCover(url)
        } else {
          setCover(originalCover.url)
        }
        onChangeData && onChangeData('cover', files?.item(0))
      },
      [onChangeData, originalCover.url]
    )

    const handleResetCover = useCallback(() => {
      setCover(originalCover.url)
      if (coverInputRef.current) {
        coverInputRef.current.files = null
      }
      onChangeData && onChangeData('cover', null)
    }, [onChangeData, originalCover.url])

    const handleChangePermalink = useCallback(
      (event: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = event.currentTarget
        const newValue = value
          .trimStart()
          .replaceAll(/[\s]/g, '-')
          .replaceAll(/[^a-zA-Z0-9가-힣ㄱ-ㅎ\_\-]/g, '')
        event.currentTarget.value = newValue
        onChangeData && onChangeData('permalink', newValue)
      },
      [onChangeData]
    )

    const handleChangePrivacy = useCallback(
      (event: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = event.currentTarget
        setStatus(value === 'public' ? true : false)
        onChangeData && onChangeData('status', value.toUpperCase())
      },
      [onChangeData]
    )

    const handleClickEditPermal = useCallback(() => {
      permalinkRef.current?.focus()
    }, [])

    const handleChangeTag = useCallback(
      (event: React.ChangeEvent<HTMLInputElement>) => {
        // 입력한 태그에 #을 자동으로 붙여준다
        const specialRegex = /[!?@#$%^*():;+=~{}<>\_\[\]\|\\\"\'\,\.\/\`\₩\s]/g

        const { value } = event.currentTarget
        const newValue =
          value.length && value[0] !== '#'
            ? `#${value}`
            : value.trim().replaceAll(specialRegex, '#').replaceAll(/#+#/g, '#')
        event.currentTarget.value = newValue
        onChangeData && onChangeData('tags', newValue.split('#').splice(1))
      },
      [onChangeData]
    )

    const handleChangeInput = useCallback(
      (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { id, value } = event.currentTarget
        if (value && onChangeData) {
          if (id === 'title' || id === 'genre' || id === 'description') {
            onChangeData(id, value)
          }
        }
      },
      [onChangeData]
    )

    const setValue = useCallback(() => {
      if (!metadata) {
        return
      }
      // 음악파일을 분석하고 앨범커버가 있으면 등록
      const {
        picture,
        title,
        genre,
        comment,
        tags,
        status: musicStatus,
        permalink,
      } = metadata
      if (picture?.length) {
        const { data, format } = picture[0]
        const url = getCoverUrlFromMetadata(data, format)
        setCover(url)

        const origin = new File(
          [data],
          `cover.${format.split('/')[1] || 'jpg'}`,
          {
            type: format,
          }
        )
        setOriginalCover({ file: origin, url })
      } else {
        setOriginalCover({})
      }

      if (title && titleRef.current) {
        titleRef.current.value = title
        if (permalinkRef.current) {
          permalinkRef.current.value =
            permalink ||
            title
              .trim()
              .replaceAll(/[\s]/g, '-')
              .replaceAll(/[^a-zA-Z0-9가-힣ㄱ-ㅎ\_\-]/g, '')
        }
      }
      if (genre?.length && genreRef.current) {
        genreRef.current.value = genre.join(' ')
      }
      if (comment?.length && descriptionRef.current) {
        descriptionRef.current.value = comment.join()
      }
      if (tags && tagRef.current) {
        tagRef.current.value = `#${tags.join('#')}`
      }
      if (musicStatus) {
        setStatus(musicStatus === 'PUBLIC' ? true : false)
      }
    }, [metadata])

    useEffect(() => {
      setValue()
    }, [setValue])

    return (
      <div {...props}>
        <S.EditBasicInfo>
          <div className="imageBox">
            <label htmlFor="coverInput">
              <AiFillCamera />
              {'Upload Image'}
            </label>
            {cover !== originalCover.url && (
              <button className="btn resetBtn" onClick={handleResetCover}>
                Reset Cover
              </button>
            )}
            <input
              id="coverInput"
              type="file"
              accept="image/*"
              hidden
              ref={coverInputRef}
              onChange={handleChangeCover}
            />
            {cover ? (
              <img className="img" src={cover} alt="cover" />
            ) : (
              <EmptyMusicCover className="img" />
            )}
          </div>
          <S.EditBasicInfoForm onSubmit={(e) => e.preventDefault()}>
            <S.EditInputBox>
              <label className="label" htmlFor="title">
                Title<span className="require">{' *'}</span>
              </label>
              <input
                ref={titleRef}
                id="title"
                type="text"
                required
                placeholder="Title of music"
                onChange={handleChangeInput}
              />
            </S.EditInputBox>
            <S.EditInputPermalink>
              <h2 className="label">
                Permalink<span className="require">{' *'}</span>
              </h2>
              <div className="inputwrap">
                <label htmlFor="permalink">{`${window.location.hostname}/${userId}/`}</label>
                <input
                  ref={permalinkRef}
                  id="permalink"
                  type="text"
                  placeholder="Your link"
                  required
                  onChange={handleChangePermalink}
                />
                <button
                  className="permalinkBtn"
                  onClick={handleClickEditPermal}
                >
                  <MdOutlineEdit />
                </button>
              </div>
            </S.EditInputPermalink>
            <S.EditInputBox>
              <label className="label" htmlFor="genre">
                Genre
              </label>
              <input
                ref={genreRef}
                id="genre"
                type="text"
                placeholder="Genre of music"
                onChange={handleChangeInput}
              />
            </S.EditInputBox>
            <S.EditInputBox>
              <label className="label" htmlFor="tag">
                Additional tags
              </label>
              <input
                ref={tagRef}
                id="tag"
                type="text"
                onBlur={handleChangeTag}
                placeholder="Add tags to describe the genre and mood of your music"
              />
            </S.EditInputBox>
            <S.EditInputBox>
              <label className="label" htmlFor="description">
                Description
              </label>
              <textarea
                ref={descriptionRef}
                id="description"
                rows={5}
                placeholder="Describe your music"
                onChange={handleChangeInput}
              />
            </S.EditInputBox>
            <S.EditInputPrivacy>
              <h2 className="label">Privacy</h2>
              <input
                type="radio"
                id="privacy-public"
                name="privacy"
                value="public"
                checked={status}
                onChange={handleChangePrivacy}
              />
              <label htmlFor="privacy-public">Public</label>
              <input
                type="radio"
                id="privacy-private"
                name="privacy"
                style={{ marginLeft: '0.5rem' }}
                value="private"
                checked={!status}
                onChange={handleChangePrivacy}
              />
              <label htmlFor="privacy-private">Private</label>
            </S.EditInputPrivacy>
          </S.EditBasicInfoForm>
        </S.EditBasicInfo>
      </div>
    )
  }
)

MusicBasicInfo.displayName = 'MusicBasicInfo'

export default MusicBasicInfo
