import React, { useCallback, useState } from 'react'
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
import {
  userToggleLikeMusic,
  userToggleRepostMusic,
} from '@redux/thunks/userThunks'

const StyledButton = styled(Button)<{ active?: boolean }>`
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

    ${({ theme }) => theme.device.desktop} {
      display: none;
    }
  }
`

interface InteractionButtonsProps extends React.HTMLAttributes<HTMLDivElement> {
  target: IMusic | IPlaylist
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setTarget?: React.Dispatch<React.SetStateAction<any>>
}

const InteractionButtons = ({
  target,
  setTarget,
  ...props
}: InteractionButtonsProps) => {
  const dispatch = useAppDispatch()
  const openLogin = useLoginOpen()
  const copyLink = useCopyLink()

  const userData = useAppSelector((state) => state.user.userData)
  const [openModal, setOpenModal] = useState(false)

  const handleClickRepost = useCallback(() => {
    if (!userData) {
      openLogin()
      return
    }

    if ('title' in target) {
      dispatch(userToggleRepostMusic(target.id)).then((value) => {
        if (value.type.indexOf('fulfilled') !== -1 && setTarget) {
          const existReposts = target.reposts || []
          const newReposts =
            value.payload.type === 'repost'
              ? [...existReposts, userData]
              : existReposts.filter((ru) => ru.id !== userData.id)
          setTarget({
            ...target,
            reposts: newReposts,
            repostsCount: newReposts.length,
          })
        }
      })
    }
  }, [dispatch, openLogin, setTarget, target, userData])

  const handleClickLike = useCallback(() => {
    if (!userData) {
      openLogin()
      return
    }

    if ('title' in target) {
      dispatch(userToggleLikeMusic(target.id)).then((value) => {
        if (value.type.indexOf('fulfilled') !== -1 && setTarget) {
          const existLikes = target.likes
          const newLikes =
            value.payload.type === 'like'
              ? [...existLikes, userData]
              : existLikes.filter((l) => l.id !== userData.id)
          setTarget({ ...target, likes: newLikes, likesCount: newLikes.length })
        }
      })
    }
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
    if ('title' in target) {
      dispatch(addMusic(target))
    } else {
      const { musics } = target
      dispatch(addMusic(musics))
    }
  }, [dispatch, target])

  return (
    <div {...props}>
      <StyledButton
        title="Like"
        active={
          userData?.likeMusics
            ? userData.likeMusics.findIndex((lm) => lm.id === target.id) !== -1
            : false
        }
        onClick={handleClickLike}
      >
        <GoHeart className="icon" />
        <span className="text">Like</span>
      </StyledButton>
      <StyledButton
        title="Repost"
        active={
          userData?.repostMusics
            ? userData.repostMusics.findIndex((rm) => rm.id === target.id) !==
              -1
            : false
        }
        onClick={handleClickRepost}
      >
        <BiRepost className="icon" />
        <span className="text">Repost</span>
      </StyledButton>
      <StyledButton title="Copy Link" onClick={handleClickCopyLink}>
        <IoMdLink className="icon" />
        <span className="text">Copy Link</span>
      </StyledButton>
      <StyledButton title="Add to Next up" onClick={handleClickNextup}>
        <MdPlaylistPlay className="icon" />
        <span className="text">Add to Next up</span>
      </StyledButton>
      {'title' in target ? (
        <>
          <StyledButton
            title="Add to Playlist"
            onClick={handleClickAddPlaylist}
          >
            <MdPlaylistAdd className="icon" />
            <span className="text">Add to Playlist</span>
          </StyledButton>
          <Modal open={openModal} onClose={closeModal}>
            <AddPlaylist
              addMusics={[target]}
              onClose={closeModal}
              onSuccess={onSuccessCreatePlaylist}
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
