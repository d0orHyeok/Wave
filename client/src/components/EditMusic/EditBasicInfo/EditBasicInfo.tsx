import React, {
  forwardRef,
  useCallback,
  useEffect,
  useRef,
  useState,
  useImperativeHandle,
} from 'react'
import * as S from './EditBasicInfo.style'
import { IMusicMetadata } from '../EditMusic'
import { useAppSelector } from '@redux/hook'
import { fileToUint8Array, getCoverUrlFromMetadata } from '@api/functions'
import { MdOutlineEdit } from 'react-icons/md'
import { AiFillCamera } from 'react-icons/ai'

export interface IEditBasicInfoHandler {
  getData: () => IEditBasicInfoValue | void
}

export interface IEditBasicInfoValue {
  title: string
  permalink: string
  genre?: string
  description?: string
  tags?: string[]
  newCover?: File
  privacy: boolean
}

interface EditBaiscInfoProps {
  metadata?: IMusicMetadata
  style?: React.CSSProperties
}

const EditBasicInfo = forwardRef<IEditBasicInfoHandler, EditBaiscInfoProps>(
  ({ metadata, style }, ref) => {
    const titleRef = useRef<HTMLInputElement>(null)
    const permalinkRef = useRef<HTMLInputElement>(null)
    const genreRef = useRef<HTMLInputElement>(null)
    const tagRef = useRef<HTMLInputElement>(null)
    const descriptionRef = useRef<HTMLTextAreaElement>(null)
    const coverInputRef = useRef<HTMLInputElement>(null)

    const permaId = useAppSelector((state) => state.user.userData?.permaId)

    const [privacy, setPrivacy] = useState(true)
    const [cover, setCover] = useState<string>('img/empty-cover.PNG')

    useImperativeHandle(
      ref,
      () => ({
        getData: () => {
          const title = titleRef.current?.value
          const permalink = permalinkRef.current?.value
          const tags = tagRef.current?.value.split('#').splice(1)
          const genre = !genreRef.current?.value
            ? undefined
            : genreRef.current.value
          const description = !descriptionRef.current?.value
            ? undefined
            : descriptionRef.current.value
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
            permalink,
            tags: tags?.length ? tags : undefined,
            genre,
            description,
            newCover,
            privacy,
          }
          return data
        },
      }),
      [privacy]
    )

    const handleChangeCover = useCallback(
      async (event: React.ChangeEvent<HTMLInputElement>) => {
        // 사용자가 앨범 이미지를 등록하면 미리보기 부분에 보여줌
        const { files } = event.currentTarget
        if (files?.length && files[0].type.includes('image/')) {
          const data = await fileToUint8Array(files[0])
          const url = getCoverUrlFromMetadata(data, files[0].type)
          setCover(url)
        }
      },
      []
    )

    const handleChangePrivacy = useCallback(
      (event: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = event.currentTarget
        setPrivacy(value === 'public' ? true : false)
      },
      []
    )

    const handleClickEditPermal = useCallback(() => {
      permalinkRef.current?.focus()
    }, [])

    const handleChangeTag = useCallback(
      (event: React.ChangeEvent<HTMLInputElement>) => {
        // 입력한 태그에 #을 자동으로 붙여준다
        const specialRegex = /[!?@#$%^*():;+=~{}<>\_\[\]\|\\\"\'\,\.\/\`\₩\s]/g

        const { value } = event.currentTarget
        event.currentTarget.value = value
          .trim()
          .replaceAll(specialRegex, '#')
          .replaceAll(/#+#/g, '#')
        if (value.length && value[0] !== '#') {
          event.currentTarget.value = '#' + event.currentTarget.value
        }
      },
      []
    )

    useEffect(() => {
      if (metadata) {
        // 음악파일을 분석하고 앨범커버가 있으면 등록
        const { picture, title, genre, description } = metadata
        if (picture?.length) {
          const { data, format } = picture[0]
          const url = getCoverUrlFromMetadata(data, format)
          setCover(url)
        } else {
          setCover('img/empty-cover.PNG')
        }

        if (title && titleRef.current) {
          titleRef.current.value = title
        }
        if (genre?.length && genreRef.current) {
          genreRef.current.value = genre.join(' ')
        }
        if (description?.length && descriptionRef.current) {
          descriptionRef.current.value = description.join()
        }
      }
    }, [metadata])

    return (
      <>
        <S.EditBasicInfo style={style}>
          <div className="imageBox">
            <label htmlFor="coverInput">
              <AiFillCamera />
              {'Upload Image'}
            </label>
            <input
              id="coverInput"
              type="file"
              accept="image/*"
              hidden
              ref={coverInputRef}
              onChange={handleChangeCover}
            />
            <img src={cover} alt="cover" />
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
              />
            </S.EditInputBox>
            <S.EditInputPermalink>
              <h2 className="label">
                Permalink<span className="require">{' *'}</span>
              </h2>
              <div className="inputwrap">
                <label htmlFor="permalink">{`${window.location.hostname}/${permaId}/`}</label>
                <input ref={permalinkRef} id="permalink" type="text" required />
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
              />
            </S.EditInputBox>
            <S.EditInputPrivacy>
              <h2 className="label">Privacy</h2>
              <input
                type="radio"
                id="privacy-public"
                name="privacy"
                value="public"
                checked={privacy}
                onChange={handleChangePrivacy}
              />
              <label htmlFor="privacy-public">Public</label>
              <input
                type="radio"
                id="privacy-private"
                name="privacy"
                style={{ marginLeft: '0.5rem' }}
                value="private"
                checked={!privacy}
                onChange={handleChangePrivacy}
              />
              <label htmlFor="privacy-private">Private</label>
            </S.EditInputPrivacy>
          </S.EditBasicInfoForm>
        </S.EditBasicInfo>
      </>
    )
  }
)

EditBasicInfo.displayName = 'EditBasicInfo'

export default EditBasicInfo
