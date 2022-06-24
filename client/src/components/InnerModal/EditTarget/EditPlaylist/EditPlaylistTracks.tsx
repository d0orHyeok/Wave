import { convertTimeToString } from '@api/functions'
import { IPlaylist } from '@appTypes/playlist.type'
import { EmptyMusicCover } from '@styles/EmptyImage'
import React from 'react'
import * as S from './EditPlaylistTracks.style'
import { RiCloseCircleFill } from 'react-icons/ri'

interface EditPlaylistTracksProps {
  playlist: IPlaylist
}

interface Prosp
  extends EditPlaylistTracksProps,
    React.HTMLAttributes<HTMLDivElement> {}

const EditPlaylistTracks = ({ playlist, ...props }: Prosp) => {
  return (
    <div {...props}>
      <S.Container>
        <ul>
          {playlist.musics.map((music, index) => (
            <S.TrackItem key={index} draggable>
              <div className="item-imageBox item-shrink">
                {music.cover ? (
                  <img className="img" src={music.cover} alt="" />
                ) : (
                  <EmptyMusicCover className="img" />
                )}
              </div>
              <div className="item-title">{`${
                music.user.nickname || music.user.username
              } - ${music.title}`}</div>
              <div className="item-duration item-shrink">
                {convertTimeToString(music.duration)}
              </div>
              <button className="item-button item-shrink">
                {<RiCloseCircleFill className="icon close" />}
              </button>
            </S.TrackItem>
          ))}
        </ul>
      </S.Container>
    </div>
  )
}

export default EditPlaylistTracks
