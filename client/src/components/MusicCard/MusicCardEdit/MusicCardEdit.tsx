import { IMusic } from '@appTypes/types.type.'
import React from 'react'

interface MusicCardEditProps {
  music: IMusic
}

const MusicCardEdit = ({ music }: MusicCardEditProps) => {
  return <div>{music?.title}</div>
}

export default MusicCardEdit
