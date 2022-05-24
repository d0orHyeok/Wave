import { userToggleFollow } from '@redux/features/user/userSlice'
import { useAppDispatch, useAppSelector } from '@redux/hook'
import { useCallback } from 'react'

function useToggleFollow() {
  const dispatch = useAppDispatch()
  const userData = useAppSelector((state) => state.user.userData)

  const toggleFollow = useCallback(
    (followerId: string) => {
      if (userData && userData.id !== followerId) {
        dispatch(
          userToggleFollow({
            followerId,
            mod:
              userData.following.findIndex((f) => f.id === followerId) === -1
                ? 'follow'
                : 'unfollow',
          })
        )
      }
    },
    [dispatch, userData]
  )

  return toggleFollow
}

export default useToggleFollow
