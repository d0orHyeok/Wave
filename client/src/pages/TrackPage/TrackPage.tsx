import React from 'react'
import { useParams } from 'react-router-dom'

const TrackPage = () => {
  const test = useParams()
  console.log(test)

  return (
    <>
      <div style={{ minHeight: '100%' }}>TrackPage {JSON.stringify(test)}</div>
    </>
  )
}

export default React.memo(TrackPage)
