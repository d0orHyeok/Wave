import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import * as S from './SearchPage.style'

const SearchPage = () => {
  const location = useLocation()

  const [keyward, setKeyward] = useState('')

  useEffect(() => {
    const result = location.search.split('query=')
    if (result.length > 1) {
      setKeyward(result[1])
    }
  }, [location])

  return (
    <S.Wrapper>
      <S.Container>{`"${keyward}" 검색결과`}</S.Container>
    </S.Wrapper>
  )
}

export default SearchPage
