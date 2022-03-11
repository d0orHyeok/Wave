import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const Main = () => {
  useEffect(() => {
    navigate('/home')
  }, [])

  const navigate = useNavigate()

  return (
    <>
      <div>mainpage</div>
    </>
  )
}

export default Main
