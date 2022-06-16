import { IMusic } from '@redux/features/player/palyerSlice.interface'
import React from 'react'

interface MusicCardEditProps {
  music: IMusic
}

const MusicCardEdit = ({ music }: MusicCardEditProps) => {
  return <div>{music?.title}</div>
}

export default MusicCardEdit
