import { selectUser } from '@redux/features/user/userSlice'
import { useAppSelector } from '@redux/hook'
import React from 'react'

const Home = () => {
  const user = useAppSelector(selectUser)

  const test = () => {
    console.log(user, user.isLogin)
  }

  return (
    <>
      <div>hello</div>
      <button onClick={test}>test</button>
    </>
  )
}

export default Home
