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
import { useCopyLink } from '@api/MusicHooks'
import { addMusic } from '@redux/features/player/playerSlice'
import AddPlaylist from '@components/InnerModal/AddPlaylist/AddPlaylist'
import { userToggleLikeMusic } from '@redux/features/user/userSlice'
import { FaPlay } from 'react-icons/fa'
import { numberFormat } from '@api/functions'

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;

  * > & {
    flex-shrink: 0;
  }
`

const StyledUl = styled.ul`
  display: flex;
  align-items: center;

  & li {
    display: flex;
    align-items: center;
    height: 20px;
    font-size: 12px;
    margin-right: 10px;

    &:last-child {
      margin-right: 0;
    }

    & .icon {
      margin-right: 5px;

      &.play {
        font-size: 10px;
      }
      &.repost {
        font-size: 14px;
      }
    }
  }
`

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

interface InteractionBarProps extends React.HTMLAttributes<HTMLDivElement> {
  target: IMusic | IPlaylist
}

const InteractionBar = ({ target, ...props }: InteractionBarProps) => {
  const dispatch = useAppDispatch()
  const openLogin = useLoginOpen()
  const copyLink = useCopyLink()

  const userData = useAppSelector((state) => state.user.userData)
  const [openModal, setOpenModal] = useState(false)
  const [like, setLike] = useState(false)

  const handleClickRepost = useCallback(() => {
    if (!userData) {
      openLogin()
      return
    }
  }, [openLogin, userData])

  const handleClickLike = useCallback(() => {
    if (!userData) {
      openLogin()
      return
    }

    if ('title' in target) {
      dispatch(
        userToggleLikeMusic({
          musicId: target.id,
          mod: like ? 'unlike' : 'like',
        })
      )
    }
  }, [userData, target, openLogin, dispatch, like])

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

  useEffect(() => {
    const result = userData?.likes.includes(target.id) || false
    setLike(result)
  }, [setLike, target, userData])

  return (
    <Container {...props}>
      <div>
        <StyledButton title="Like" active={like} onClick={handleClickLike}>
          <GoHeart className="icon" />
          <span className="text">Like</span>
        </StyledButton>
        <StyledButton title="Repost" onClick={handleClickRepost}>
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
              <AddPlaylist addMusics={[target]} onClose={closeModal} />
            </Modal>
          </>
        ) : (
          <></>
        )}
      </div>
      {'title' in target ? (
        <StyledUl>
          <li title={`${target.count.toLocaleString()} plays`}>
            <FaPlay className="icon play" />
            {numberFormat(target.count)}
          </li>
          <li title={`any likes`}>
            <GoHeart className="icon heart" />
            11
          </li>
          <li title="any reposts">
            <BiRepost className="icon repost" />
            11
          </li>
        </StyledUl>
      ) : (
        <></>
      )}
    </Container>
  )
}

export default InteractionBar
