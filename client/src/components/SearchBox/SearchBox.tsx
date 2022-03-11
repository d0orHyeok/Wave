import React, { useState } from 'react'
import * as S from './SearchBox.style.'
import { BsSearch } from 'react-icons/bs'
import { MdCancel } from 'react-icons/md'
import { useNavigate } from 'react-router-dom'

const SearchBox = () => {
  const navigate = useNavigate()

  const [focused, setFocused] = useState(false)
  const [text, setText] = useState('')

  const searchMusic = () => {
    navigate(`search?query=${text}`)
  }
  const onKeyPressHandler = (event: React.KeyboardEvent<HTMLInputElement>) => {
    event.key === 'Enter' && searchMusic()
  }
  const onFocusHandler = () => setFocused(true)
  const onBlurHandler = () => setFocused(false)
  const onChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    setText(event.currentTarget.value)
  }

  return (
    <>
      <S.Container active={focused}>
        <button className="searchBtn" onClick={searchMusic}>
          <BsSearch />
        </button>
        <input
          className="search-input"
          type="text"
          placeholder="WAVE 검색"
          value={text}
          onKeyPress={onKeyPressHandler}
          onChange={onChangeHandler}
          onFocus={onFocusHandler}
          onBlur={onBlurHandler}
        />
        {(text || focused) && (
          <button className="cancelBtn" onClick={() => setText('')}>
            <MdCancel />
          </button>
        )}
      </S.Container>
    </>
  )
}

export default React.memo(SearchBox)
