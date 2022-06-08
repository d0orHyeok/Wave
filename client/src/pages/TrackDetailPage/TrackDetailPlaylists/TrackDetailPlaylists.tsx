import { findDetailPlaylistsByMusicId } from '@api/playlistApi'
import PlaylistCard from '@components/PlaylistCard/PlaylistCard'
import { IPlaylist } from '@redux/features/player/palyerSlice.interface'
import React, { useEffect, useState } from 'react'
import styled from 'styled-components'

const NoPlaylsts = styled.div`
  padding: 10vh 0;
  text-align: center;
  font-size: 20px;
  line-height: 30px;
  color: ${({ theme }) => theme.colors.bgTextRGBA(0.6)};
`

interface TrackDetailPlaylistsProps
  extends React.HTMLAttributes<HTMLDivElement> {
  musicId: number
}

const TrackDetailPlaylists = ({
  musicId,
  ...props
}: TrackDetailPlaylistsProps) => {
  const [playlists, setPlaylists] = useState<IPlaylist[]>([])

  useEffect(() => {
    findDetailPlaylistsByMusicId(musicId)
      .then((res) => {
        setPlaylists(res.data)
      })
      .catch((error) => {
        console.error(error.response || error)
      })
  }, [musicId])

  return (
    <>
      <div {...props}>
        {playlists.length ? (
          playlists.map((playlist, index) => (
            <PlaylistCard key={index} playlist={playlist} />
          ))
        ) : (
          <NoPlaylsts>
            Sorry...
            <br />
            {`There's no playlist`}
          </NoPlaylsts>
        )}
      </div>
    </>
  )
}

export default TrackDetailPlaylists
