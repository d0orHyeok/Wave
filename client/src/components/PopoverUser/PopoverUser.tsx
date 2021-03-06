import styled from 'styled-components'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { IUser } from '@appTypes/types.type.'

import PopoverContent from './PopoverContent'

interface PopoverDivProps {
  open?: boolean
  reverse?: boolean
  parentHeight?: number
  parentWidth?: number
}

const PopoverDiv = styled.div<PopoverDivProps>`
  &::before {
    border: 1px solid;
    border-color: inherit;
    content: '';
    position: absolute;
    ${({ reverse }) =>
      reverse
        ? 'bottom: -7px; border-left: none; border-top: none;'
        : 'top: -7px; border-right: none; border-bottom: none;'}
    left: 50%;
    width: 12px;
    height: 12px;
    background-color: inherit;
    transform: translateX(-50%) rotate(45deg);
  }

  &::after {
    content: '';
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    ${({ reverse }) => (reverse ? 'bottom' : 'top')}: -15px;
    width: ${({ parentWidth }) => (parentWidth ? `${parentWidth}px` : '160px')};
    height: 15px;
    opacity: 0;
  }

  position: absolute;
  ${({ reverse }) => (reverse ? 'bottom' : 'top')}: 100%;
  left: 50%;
  transform: translate(-50%, ${({ reverse }) => (reverse ? '-7px' : '7px')});
  z-index: 100;

  border: 1px solid;
  border-color: ${({ theme }) => theme.colors.border1};
  border-radius: 4px;
  box-shadow: 0 2px 5px 0 ${({ theme }) => theme.colors.bgTextRGBA(0.16)};
  background-color: ${({ theme }) => theme.colors.bgColor};

  display: ${({ open }) => (open ? 'block' : 'none')};
`

interface PopoverUserProps extends React.HTMLAttributes<HTMLDivElement> {
  user: IUser
}

const PopoverUser = ({ user, ...props }: PopoverUserProps) => {
  const popoverRef = useRef<HTMLDivElement>(null)

  const [anchorTop, setAnchorTop] = useState(false)
  const [open, setOpen] = useState(false)
  const [parentWidth, setParentWidth] = useState<number>()

  const handleOpen = useCallback((event: MouseEvent) => {
    event.preventDefault()
    setOpen(true)
  }, [])

  const handleClose = useCallback((event: MouseEvent) => {
    event.preventDefault()
    setAnchorTop(false)
    setOpen(false)
  }, [])

  useEffect(() => {
    const parentEl = popoverRef.current?.parentElement
    if (!parentEl) {
      return
    }

    parentEl.style.position = 'relative'
    const parentData = parentEl.getBoundingClientRect()
    setParentWidth(parentData.width)

    parentEl.addEventListener('mouseenter', handleOpen)
    parentEl.addEventListener('mouseleave', handleClose)
    return () => {
      parentEl.removeEventListener('mouseleave', handleOpen)
      parentEl.removeEventListener('mouseleave', handleClose)
    }
  }, [handleClose, handleOpen])

  useEffect(() => {
    const popoverEl = popoverRef.current?.children.item(0)
    if (open && popoverEl) {
      const popoverRect = popoverEl.getBoundingClientRect()

      const pageHeight = window.innerHeight - 81

      if (pageHeight < popoverRect.bottom) {
        setAnchorTop(true)
      } else {
        setAnchorTop(false)
      }
    }
  }, [open])

  return (
    <PopoverDiv
      {...props}
      ref={popoverRef}
      open={open}
      reverse={anchorTop}
      parentWidth={parentWidth}
    >
      <PopoverContent user={user} />
    </PopoverDiv>
  )
}

export default PopoverUser
