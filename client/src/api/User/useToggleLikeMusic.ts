import { userPullLikes, userPushLikes } from '@redux/features/user/userSlice'
import { useAppDispatch, useAppSelector } from '@redux/hook'
import { useCallback } from 'react'

function useToggleLikeMusic() {
  const dispatch = useAppDispatch()
  const likes = useAppSelector((state) => state.user.userData?.likes)

  const toggleLikeMusic = useCallback(
    (musicId: number) => {
      if (likes) {
        const isLike = likes.includes(musicId)
        !isLike
          ? dispatch(userPushLikes(musicId))
          : dispatch(userPullLikes(musicId))
      }
    },
    [dispatch, likes]
  )

  return toggleLikeMusic
}

export default useToggleLikeMusic
