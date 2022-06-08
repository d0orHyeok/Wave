import React, { useCallback, useEffect, useState } from 'react'
import styled from 'styled-components'
import { IoMdLink } from 'react-icons/io'
import { GoHeart } from 'react-icons/go'
import { MdPlaylistPlay, MdPlaylistAdd } from 'react-icons/md'
import { BiRepost } from 'react-icons/bi'
import { Button, Modal } from '@components/Common'
import { IMusic, IPlaylist } from '@redux/features/player/palyerSlice.interface'
import { useAppDispatch, useAppSelector } from '@redux/hook'
import { useLoginOpen } from '@redux/context/loginProvider'
import { useCopyLink } from '@api/Hooks'
import { addMusic } from '@redux/features/player/playerSlice'
import AddPlaylist from '@components/InnerModal/AddPlaylist/AddPlaylist'
import { userToggleLike, userToggleRepost } from '@redux/thunks/userThunks'

interface StyledButtonProps {
  active?: boolean
  mediaSize?: number | string
}

const StyledButton = styled(Button)<StyledButtonProps>`
  position: relative;
  height: 27px;
  margin-right: 5px;
  border-radius: 3px;

  &:last-child {
    margin-right: 0;
  }

  ${({ theme, active }) =>
    active &&
    `
    &, &:hover {
    border-color: ${theme.colors.primaryColor};
    color: ${theme.colors.primaryColor};
    }`}

  & .icon {
    position: relative;
    top: 50%;
    transform: translateY(-50%);
    font-size: 18px;
    margin: 0 5px;
  }

  & .text {
    display: inline-block;
    font-size: 13px;
    height: 25px;
    margin-right: 5px;

    @media screen and (max-width: ${({ mediaSize }) =>
        mediaSize === undefined
          ? '1200px'
          : typeof mediaSize === 'string'
          ? mediaSize
          : `${mediaSize}px`}) {
      display: none;
    }
  }
`

type TargetType = IMusic | IPlaylist

interface InteractionButtonsProps extends React.HTMLAttributes<HTMLDivElement> {
  target: TargetType
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setTarget?: React.Dispatch<React.SetStateAction<any>>
  mediaSize?: number | string
}

const InteractionButtons = ({
  target,
  setTarget,
  mediaSize,
  ...props
}: InteractionButtonsProps) => {
  const dispatch = useAppDispatch()
  const openLogin = useLoginOpen()
  const copyLink = useCopyLink()

  const userData = useAppSelector((state) => state.user.userData)
  const [openModal, setOpenModal] = useState(false)
  const [isLike, setIsLike] = useState(false)
  const [isReposts, setIsReposts] = useState(false)

  const handleClickRepost = useCallback(() => {
    if (!userData) {
      openLogin()
      return
    }

    const targetType = 'title' in target ? 'music' : 'playlist'
    dispatch(userToggleRepost({ targetId: target.id, targetType })).then(
      (value) => {
        if (value.type.indexOf('fulfilled') !== -1 && setTarget) {
          const existReposts = target.reposts || []
          const newReposts =
            value.payload.data.toggleType === 'repost'
              ? [...existReposts, userData]
              : existReposts.filter((ru) => ru.id !== userData.id)
          setTarget({
            ...target,
            reposts: newReposts,
            repostsCount: newReposts.length,
          })
        }
      }
    )
  }, [dispatch, openLogin, setTarget, target, userData])

  const handleClickLike = useCallback(() => {
    if (!userData) {
      openLogin()
      return
    }

    const targetType = 'title' in target ? 'music' : 'playlist'
    dispatch(userToggleLike({ targetId: target.id, targetType })).then(
      (value) => {
        if (value.type.indexOf('fulfilled') !== -1 && setTarget) {
          const existLikes = target.likes || []
          const newLikes =
            value.payload.data.toggleType === 'like'
              ? [...existLikes, userData]
              : existLikes.filter((l) => l.id !== userData.id)
          setTarget({ ...target, likes: newLikes, likesCount: newLikes.length })
        }
      }
    )
  }, [userData, target, openLogin, dispatch, setTarget])

  const onSuccessCreatePlaylist = useCallback(
    (createPlaylist: IPlaylist) => {
      if (!('title' in target) || !setTarget) {
        return
      }
      const existPlaylists = target.playlists || []
      const newPlaylists = [...existPlaylists, createPlaylist]
      setTarget({
        ...target,
        playlists: newPlaylists,
        playlistsCount: newPlaylists.length,
      })
    },
    [setTarget, target]
  )

  const onRemoveMusicSuccess = useCallback(
    (playlistId: number) => {
      if (!('title' in target) || !setTarget) {
        return
      }
      const existPlaylists = target.playlists || []
      const newPlaylists = existPlaylists.filter(
        (playlist) => playlist.id !== playlistId
      )
      setTarget({
        ...target,
        playlists: newPlaylists,
        playlistsCount: newPlaylists.length,
      })
    },
    [setTarget, target]
  )

  const handleClickAddPlaylist = useCallback(() => {
    if (!userData) {
      openLogin()
      return
    }

    setOpenModal(true)
  }, [openLogin, userData])

  const closeModal = () => {
    setOpenModal(false)
  }

  const handleClickCopyLink = useCallback(() => {
    copyLink(target.permalink, {
      success: 'Link Copied',
      fail: 'Fail to copy link',
    })
  }, [copyLink, target])

  const handleClickNextup = useCallback(() => {
    const additem = 'title' in target ? [target] : target.musics || []

    dispatch(addMusic(additem))
  }, [dispatch, target])

  useEffect(() => {
    if (!userData) {
      setIsLike(false)
      setIsReposts(false)
      return
    }

    let userLikes: TargetType[] = []
    let userReposts: TargetType[] = []
    if ('title' in target) {
      userLikes = userData.likeMusics || []
      userReposts = userData.repostMusics || []
    } else {
      userLikes = userData.likePlaylists || []
      userReposts = userData.repostPlaylists || []
    }

    const booleanLike = userLikes.findIndex((l) => l.id === target.id) !== -1
    const booleanRepost =
      userReposts.findIndex((r) => r.id === target.id) !== -1
    setIsLike(booleanLike)
    setIsReposts(booleanRepost)
  }, [target, userData])

  return (
    <div {...props}>
      <StyledButton
        title="Like"
        active={isLike}
        mediaSize={mediaSize}
        onClick={handleClickLike}
      >
        <GoHeart className="icon" />
        <span className="text">Like</span>
      </StyledButton>
      <StyledButton
        title="Repost"
        active={isReposts}
        mediaSize={mediaSize}
        onClick={handleClickRepost}
      >
        <BiRepost className="icon" />
        <span className="text">Repost</span>
      </StyledButton>
      <StyledButton
        title="Copy Link"
        mediaSize={mediaSize}
        onClick={handleClickCopyLink}
      >
        <IoMdLink className="icon" />
        <span className="text">Copy Link</span>
      </StyledButton>
      <StyledButton
        title="Add to Next up"
        mediaSize={mediaSize}
        onClick={handleClickNextup}
      >
        <MdPlaylistPlay className="icon" />
        <span className="text">Add to Next up</span>
      </StyledButton>
      {'title' in target ? (
        <>
          <StyledButton
            title="Add to Playlist"
            mediaSize={mediaSize}
            onClick={handleClickAddPlaylist}
          >
            <MdPlaylistAdd className="icon" />
            <span className="text">Add to Playlist</span>
          </StyledButton>
          <Modal open={openModal} onClose={closeModal}>
            <AddPlaylist
              addMusics={[target]}
              onClose={closeModal}
              onCreateSuccess={onSuccessCreatePlaylist}
              onAddSuccess={onSuccessCreatePlaylist}
              onRemoveSuccess={onRemoveMusicSuccess}
            />
          </Modal>
        </>
      ) : (
        <></>
      )}
    </div>
  )
}

export default InteractionButtons
