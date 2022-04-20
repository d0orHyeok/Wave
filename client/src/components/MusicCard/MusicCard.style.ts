import styled from 'styled-components'

export const CardContainer = styled.div`
  display: inline-block;
`

export const ImageBox = styled.div`
  position: relative;
  min-width: 100px;
  min-height: 100px;
  max-width: 200px;
  max-height: 200px;
  width: 100%;
  height: 100%;

  & img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: ease 0.2s all;
  }

  & .cardHoverBtn {
    display: none;
  }

  &:hover {
    & img {
      filter: saturate(100%) brightness(40%);
    }

    & .cardHoverBtn {
      display: block;
    }
  }
`

export const CardButton = styled.button`
  position: absolute;
  border: none;
  font-size: 20px;
  color: white;
`

export const CardPlayButton = styled(CardButton)`
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  padding: 0;
`

export const CardMoreButton = styled(CardButton)`
  bottom: 0;
  right: 0;
`

export const CardControlBox = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
`

export const CartInfoBox = styled.div`
  max-width: 200px;
  width: 100%;
  font-size: 0.9rem;
  padding: 6px 0;
  & .musicCard-title {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    cursor: pointer;
  }
`
