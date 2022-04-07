import React, {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react'
import * as S from './EditContent.style'
import { MetaData } from '../EditMusic'
import { useAppSelector } from '@redux/hook'
import { MdOutlineEdit } from 'react-icons/md'
import { AiFillCamera } from 'react-icons/ai'
import { fileToUint8Array, getCoverUrlFromMetadata } from '@api/functions'

export interface IEditContentHandle {
  getData: () => IEditMetadataRetrunValue | void
}

export interface IEditMetadataRetrunValue {
  title: string
  permalink: string
  genre?: string
  description?: string
  tag?: string
  newCover?: File
}

interface EditContentProps {
  metadata?: MetaData
}

const EditContent = forwardRef<IEditContentHandle, EditContentProps>(
  ({ metadata }, ref) => {
    const editNavItems = ['Basic Info', 'Metadata']

    const titleRef = useRef<HTMLInputElement>(null)
    const permalinkRef = useRef<HTMLInputElement>(null)
    const genreRef = useRef<HTMLInputElement>(null)
    const tagRef = useRef<HTMLInputElement>(null)
    const descriptionRef = useRef<HTMLTextAreaElement>(null)
    const coverInputRef = useRef<HTMLInputElement>(null)

    const permaId = useAppSelector((state) => state.user.userData?.permaId)

    const [editNavIndex, setEditNavIndex] = useState(0)
    const [cover, setCover] = useState<string>('img/empty-cover.PNG')

    useImperativeHandle(
      ref,
      () => ({
        getData: () => {
          const title = titleRef.current?.value
          const permalink = permalinkRef.current?.value
          const tags = tagRef.current?.value.split('#')
          const newCoverFiles = coverInputRef.current?.files

          if (!title) {
            titleRef.current?.focus()
            return alert('Please enter a title')
          }
          if (!permalink) {
            permalinkRef.current?.focus()
            return alert('Please enter a permalink')
          }

          const data = {
            title,
            permalink,
            tags,
            genre: genreRef.current?.value,
            description: descriptionRef.current?.value,
            newCover: newCoverFiles?.length ? newCoverFiles[0] : undefined,
          }
          return data
        },
      }),
      []
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
        console.log(metadata)

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

        <S.EditBasicInfo
          style={{ display: editNavIndex === 0 ? 'flex' : 'none' }}
        >
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
              <input ref={titleRef} id="title" type="text" required />
            </S.EditInputBox>
            <S.EditInputBox>
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
            </S.EditInputBox>
            <S.EditInputBox>
              <label className="label" htmlFor="genre">
                Genre
              </label>
              <input ref={genreRef} id="genre" type="text" />
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
              />
            </S.EditInputBox>
            <S.EditInputBox>
              <label className="label" htmlFor="description">
                Description
              </label>
              <textarea ref={descriptionRef} id="description" rows={5} />
            </S.EditInputBox>
          </S.EditBasicInfoForm>
        </S.EditBasicInfo>
      </>
    )
  }
)

EditContent.displayName = 'EditContent'

export default EditContent
