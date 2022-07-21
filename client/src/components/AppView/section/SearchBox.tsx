import React, { useEffect, useRef, useState } from 'react'
import * as S from './SearchBox.style.'
import { BsSearch } from 'react-icons/bs'
import { MdCancel } from 'react-icons/md'
import { useNavigate } from 'react-router-dom'

interface SearchBoxProps {
  className?: string
  windowWidth?: number
}

const SearchBox = ({ className, windowWidth }: SearchBoxProps) => {
  const navigate = useNavigate()

  const [focused, setFocused] = useState(false)
  const [text, setText] = useState('')
  const [open, setOpen] = useState(true)
  const inputRef = useRef<HTMLInputElement>(null)

  const closeSearchBox = () => {
    if (windowWidth && windowWidth < 800 && open) {
      setOpen(false)
    }
  }

  const onClickMusicBtn = () => {
    open ? searchMusic() : setOpen(true)
    closeSearchBox()
  }

  const onClickCancelBtn = () => {
    setText('')
    closeSearchBox()
  }

  const searchMusic = () => {
    if (!text) {
      return
    }
    navigate(`search?query=${text}`)
  }

  const onKeyPressHandler = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      searchMusic()
    }
  }
  const onFocusHandler = () => setFocused(true)
  const onBlurHandler = () => setFocused(false)

  const onChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    setText(event.currentTarget.value)
  }

  useEffect(() => {
    if (windowWidth) {
      if (windowWidth < 800) {
        setOpen(false)
      }
    }
  }, [windowWidth])

  return (
    <S.Wrapper className={className && className} open={open}>
      <S.Container active={focused} open={open}>
        <button className="searchBtn" onClick={onClickMusicBtn}>
          <BsSearch />
        </button>
        <input
          ref={inputRef}
          className="search-input"
          type="text"
          placeholder="WAVE 검색"
          value={text}
          onKeyPress={onKeyPressHandler}
          onChange={onChangeHandler}
          onFocus={onFocusHandler}
          onBlur={onBlurHandler}
        />
        {(text || focused || open) && (
          <button className="cancelBtn" onClick={onClickCancelBtn}>
            <MdCancel />
          </button>
        )}
      </S.Container>
    </S.Wrapper>
  )
}

export default React.memo(SearchBox)
