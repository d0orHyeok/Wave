import { userToggleLikeMusic } from '@redux/features/user/userSlice'
import { useAppDispatch, useAppSelector } from '@redux/hook'
import { useCallback } from 'react'

function useToggleLikeMusic() {
  const dispatch = useAppDispatch()
  const likes = useAppSelector((state) => state.user.userData?.likes)

  const toggleLikeMusic = useCallback(
    (musicId: number) => {
      if (likes) {
        dispatch(
          userToggleLikeMusic({
            musicId,
            mod: likes.includes(musicId) ? 'unlike' : 'like',
          })
        )
      }
    },
    [dispatch, likes]
  )

  return toggleLikeMusic
}

export default useToggleLikeMusic
