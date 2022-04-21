import { userToggleLikeMusic } from '@redux/features/user/userSlice'
import { useAppDispatch, useAppSelector } from '@redux/hook'
import { useCallback } from 'react'

function useToggleLikeMusic() {
  const dispatch = useAppDispatch()
  const likes = useAppSelector((state) => state.user.userData?.likes)

  const toggleLikeMusic = useCallback(
    (musicId: number) => {
      if (likes) {
        const params = { musicId, isLike: !likes.includes(musicId) }
        dispatch(userToggleLikeMusic(params))
      }
    },
    [dispatch, likes]
  )

  return toggleLikeMusic
}

export default useToggleLikeMusic
