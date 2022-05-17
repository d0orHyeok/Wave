import { IMusic } from '@redux/features/player/palyerSlice.interface'
import React, { useState, useCallback, useEffect } from 'react'
import { StyledDivider } from '../common.style'
import * as S from './AddPlaylist.style'
import { MdClose } from 'react-icons/md'
import { useAppSelector } from '@redux/hook'
import EmptyPlaylistImage from '@components/EmptyImage/EmptyPlaylistImage'

interface AddPlaylistProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onClose: any
  addMusics?: IMusic[]
}

const AddPlaylist = ({ onClose, addMusics }: AddPlaylistProps) => {
  const playlists =
    useAppSelector((state) => state.user.userData?.playlists) || []
  const [navIndex, setNavIndex] = useState(0)
  const [newPlaylist, setNewPlaylist] = useState({
    title: '',
    privacy: 'PUBLIC',
  })
  const [filter, setFilter] = useState('')
  const [musics, setMusics] = useState<IMusic[]>([])

  const handleClickPrivacy = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const { id } = event.currentTarget
      setNewPlaylist({ ...newPlaylist, privacy: id.toUpperCase() })
    },
    [newPlaylist]
  )

  const handleChangeInput = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const { id, value } = event.currentTarget
      if (id === 'filter') {
        setFilter(value)
      } else {
        setNewPlaylist({ ...newPlaylist, title: value })
      }
    },
    [newPlaylist]
  )

  const createPlaylist = () => {
    if (newPlaylist.title.length < 2) {
      return alert('2자 이상의 제목을 입력해 주세요.')
    }

    setNewPlaylist({ title: '', privacy: 'PUBLIC' })
    onClose()
  }

  const pullMusic = useCallback(
    (index: number) => (event: React.MouseEvent<HTMLButtonElement>) => {
      event.preventDefault()
      setMusics(musics.filter((_, n) => index !== n))
    },
    [musics]
  )

  useEffect(() => {
    setMusics(addMusics || [])
  }, [addMusics])

  return (
    <S.Wrapper>
      <S.Container>
        <S.TitleUllist className="title">
          <S.TitleItem select={navIndex === 0} onClick={() => setNavIndex(0)}>
            Add to playlist
          </S.TitleItem>
          <S.TitleItem select={navIndex === 1} onClick={() => setNavIndex(1)}>
            Create playlist
          </S.TitleItem>
        </S.TitleUllist>
        <StyledDivider />
        {navIndex === 0 ? (
          // Add Music to Playlist
          <S.AddContent>
            <S.TextInput
              id="filter"
              type="text"
              value={filter}
              onChange={handleChangeInput}
              placeholder="Filter playlists"
              style={{ width: '100%' }}
            />
            <ul>
              {playlists.map((playlist, index) => {
                return (
                  <S.PlaylistItem key={index}>
                    <div className="image">
                      {playlist.image ? (
                        <img src={playlist.image} alt="" />
                      ) : (
                        <EmptyPlaylistImage size={50} />
                      )}
                    </div>
                    <div className="info">
                      <div className="info-name">test</div>
                      <div className="info-num">1 musics</div>
                    </div>
                    <S.AddButton added={true}>Add to playlist</S.AddButton>
                  </S.PlaylistItem>
                )
              })}
            </ul>
          </S.AddContent>
        ) : (
          // Create Playlist
          <>
            <S.CreatePlaylist>
              <div className="inputBox">
                <S.Label>
                  Playlist title<span>{' *'}</span>
                </S.Label>
                <S.TextInput
                  id="title"
                  type="text"
                  value={newPlaylist.title}
                  onChange={handleChangeInput}
                />
              </div>
              <div className="inputBox flex">
                <S.Label>{`Privacy: `}</S.Label>
                <input
                  type="radio"
                  id="public"
                  name="privacy"
                  onChange={handleClickPrivacy}
                  checked={newPlaylist.privacy.toLowerCase() === 'public'}
                />
                <label htmlFor="public">Public</label>
                <input
                  type="radio"
                  id="private"
                  name="privacy"
                  onChange={handleClickPrivacy}
                  checked={newPlaylist.privacy.toLowerCase() === 'private'}
                />
                <label htmlFor="private">Private</label>
              </div>
              <S.SaveButton onClick={createPlaylist}>Save</S.SaveButton>
            </S.CreatePlaylist>
            <S.AddMusicsWrapper>
              {musics.map((music, index) => {
                return (
                  <S.AddItem key={index}>
                    <div className="music-cover">
                      <img src={music.cover || 'img/empty-cover.PNG'} alt="" />
                    </div>
                    <div className="music-name">
                      <span>{`${
                        music.user?.nickname || music.userId
                      } - `}</span>
                      {music.title}
                    </div>
                    <button className="music-close" onClick={pullMusic(index)}>
                      <MdClose />
                    </button>
                  </S.AddItem>
                )
              })}
              {musics.length < 4 &&
                Array.from({ length: 4 - musics.length }, (_, i) => i).map(
                  (_, index) => <S.AddItem key={index}></S.AddItem>
                )}
            </S.AddMusicsWrapper>
          </>
        )}
      </S.Container>
    </S.Wrapper>
  )
}

export default AddPlaylist
