import { userToggleLikeMusic } from '@redux/features/user/userSlice'
import { useAppDispatch, useAppSelector } from '@redux/hook'
import { useCallback } from 'react'

function useToggleLikeMusic() {
  const dispatch = useAppDispatch()
  const likeMusics = useAppSelector((state) => state.user.userData?.likeMusics)

  const toggleLikeMusic = useCallback(
    (musicId: number) => {
      if (likeMusics) {
        dispatch(
          userToggleLikeMusic({
            musicId,
            mod:
              likeMusics?.findIndex((lm) => lm.id === musicId) !== -1
                ? 'unlike'
                : 'like',
          })
        )
      }
    },
    [dispatch, likeMusics]
  )

  return toggleLikeMusic
}

export default useToggleLikeMusic
