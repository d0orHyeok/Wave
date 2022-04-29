import Axios from '@api/Axios'
import { IMusic } from '@redux/features/player/palyerSlice.interface'
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

const TrackPage = () => {
  const { '*': permalink } = useParams()
  const navigate = useNavigate()

  const [music, setMusic] = useState<IMusic>()

  useEffect(() => {
    Axios.get(`/api/music/${permalink}`)
      .then((res) => setMusic(res.data))
      .catch(() => navigate('/track/notfound'))
  }, [navigate, permalink])

  return (
    <>
      <div style={{ minHeight: '100%' }}>{JSON.stringify(music)}</div>
    </>
  )
}

export default React.memo(TrackPage)
