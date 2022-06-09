import React, { useCallback, useEffect } from 'react'
import * as S from './MusicListDrawer.style'

interface IMusicListDrawer {
  open: boolean
  onClose: any
  children?: React.ReactNode
}

const MusicListDrawer = ({ open, onClose, children }: IMusicListDrawer) => {
  const handleClose = useCallback(
    (event: React.MouseEvent<HTMLElement>) => {
      if (event.target !== event.currentTarget) {
        return
      }
      onClose()
    },
    [onClose]
  )

  const keyboardEvent = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose()
      }
    },
    [onClose]
  )

  useEffect(() => {
    if (open) {
      window.addEventListener('keydown', keyboardEvent)
    } else {
      window.removeEventListener('keydown', keyboardEvent)
    }
  }, [keyboardEvent, open])

  useEffect(() => {
    const body = document.body
    body.style.overflow = open ? 'hidden' : 'auto'
  }, [open])

  return (
    <>
      <S.Drawer open={open}>
        <S.Container onClick={handleClose}>{children}</S.Container>
      </S.Drawer>
    </>
  )
}

export default React.memo(MusicListDrawer)
