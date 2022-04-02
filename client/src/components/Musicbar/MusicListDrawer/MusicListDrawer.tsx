import React, { useEffect } from 'react'
import * as S from './MusicListDrawer.style'

interface IMusicListDrawer {
  open: boolean
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onClose: any
  children?: React.ReactNode
}

const MusicListDrawer = ({ open, onClose, children }: IMusicListDrawer) => {
  const handleClose = (event: React.MouseEvent<HTMLElement>) => {
    if (event.target !== event.currentTarget) {
      return
    }
    onClose()
  }

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
