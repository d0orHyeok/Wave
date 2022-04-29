import { userToggleFollow } from '@redux/features/user/userSlice'
import { useAppDispatch, useAppSelector } from '@redux/hook'
import { useCallback } from 'react'

function useToggleFollow() {
  const dispatch = useAppDispatch()
  const following = useAppSelector((state) => state.user.userData?.following)

  const toggleFollow = useCallback(
    (followerId: string) => {
      if (following) {
        const params = {
          followerId,
          isFollow: following.findIndex((f) => f.id === followerId) === -1,
        }
        dispatch(userToggleFollow(params))
      }
    },
    [dispatch, following]
  )

  return toggleFollow
}

export default useToggleFollow
