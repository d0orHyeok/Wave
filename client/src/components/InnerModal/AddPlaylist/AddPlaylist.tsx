import { IMusic } from '@redux/features/player/palyerSlice.interface'
import React, { useState, useCallback, useEffect } from 'react'
import { StyledDivider } from '../common.style'
import * as S from './AddPlaylist.style'
import { MdClose } from 'react-icons/md'
import { useAppDispatch, useAppSelector } from '@redux/hook'
import EmptyPlaylistImage from '@styles/EmptyImage/EmptyPlaylistImage.stlye'
import EmptyMusicCover from '@styles/EmptyImage/EmptyMusicCover.style'
import { BsSoundwave } from 'react-icons/bs'
import {
  userAddMusicsToPlaylist,
  userCreatePlaylist,
  userDeleteMusicsFromPlaylist,
} from '@redux/thunks/playlistThunks'

interface AddPlaylistProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onClose: any
  addMusics?: IMusic[]
}

const AddPlaylist = ({ onClose, addMusics }: AddPlaylistProps) => {
  const dispatch = useAppDispatch()

  const playlists =
    useAppSelector((state) => state.user.userData?.playlists) || []
  const [navIndex, setNavIndex] = useState(0)
  //  플레이 리스트 생성 정보
  const [newPlaylist, setNewPlaylist] = useState({
    title: '',
    privacy: 'PUBLIC',
  })
  const [filter, setFilter] = useState('') // 플레이리스트 검색 필터
  const [musics, setMusics] = useState<IMusic[]>([]) // 플레이리스트에 추가할 음악

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

  const createPlaylist = useCallback(() => {
    if (newPlaylist.title.length < 2) {
      return alert('2자 이상의 제목을 입력해 주세요.')
    }

    const body = {
      name: newPlaylist.title,
      musicIds: musics.map((music) => music.id),
      status: newPlaylist.privacy,
    }

    dispatch(userCreatePlaylist(body)).then((value) => {
      if (value.type.indexOf('fulfilled') !== -1) {
        console.log('success to create playlist')
      }
    })

    setNewPlaylist({ title: '', privacy: 'PUBLIC' })
    onClose()
  }, [dispatch, musics, newPlaylist, onClose])

  const pullMusic = useCallback(
    // 추가할 음악 제거
    (index: number) => (event: React.MouseEvent<HTMLButtonElement>) => {
      event.preventDefault()
      setMusics(musics.filter((_, n) => index !== n))
    },
    [musics]
  )

  const addMusicsToPlaylist = useCallback(
    (musics: IMusic[]) => (event: React.MouseEvent<HTMLElement>) => {
      const playlistId = event.currentTarget.getAttribute('data-playlistid')
      if (playlistId) {
        const params = { playlistId, musicIds: musics.map((music) => music.id) }
        dispatch(userAddMusicsToPlaylist(params))
      }
    },
    [dispatch]
  )

  const deleteMusicsFromPlaylist = useCallback(
    (event: React.MouseEvent<HTMLElement>) => {
      const playlistId = event.currentTarget.getAttribute('data-playlistid')
      if (playlistId) {
        const params = { playlistId, musicIds: musics.map((music) => music.id) }
        dispatch(userDeleteMusicsFromPlaylist(params))
      }
    },
    [dispatch, musics]
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
                if (playlist.name.indexOf(filter) === -1) {
                  return
                }

                let added = false
                let filteredMusics = musics
                if (filteredMusics.length === 1) {
                  added =
                    playlist.musics.findIndex(
                      (pm) => pm.id === musics[0].id
                    ) !== -1
                } else {
                  filteredMusics = musics.filter(
                    (music) =>
                      playlist.musics.findIndex((pm) => pm.id === music.id) ===
                      -1
                  )
                  added = filteredMusics.length ? false : true
                }
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
                      <div className="info-name">{playlist.name}</div>
                      <div
                        className="info-num"
                        title={`${playlist.musics.length} musics`}
                      >
                        <BsSoundwave size={14} style={{ marginRight: '4px' }} />
                        {playlist.musics.length}
                      </div>
                    </div>
                    <S.AddButton
                      added={added}
                      data-playlistid={playlist.id}
                      onClick={
                        !added
                          ? addMusicsToPlaylist(filteredMusics)
                          : deleteMusicsFromPlaylist
                      }
                    >
                      {added ? 'Added' : 'Add to playlist'}
                    </S.AddButton>
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
                      {music.cover ? (
                        <img className="img" src={music.cover} alt="" />
                      ) : (
                        <EmptyMusicCover className="img" />
                      )}
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
