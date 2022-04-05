import React, { useRef } from 'react'
import * as mmb from 'music-metadata-browser'

const Upload = () => {
  const inputRef = useRef<HTMLInputElement>(null)

  const test = async () => {
    const file = inputRef.current?.files[0]

    if (file) {
      console.log(`Parsing file "${file.name}" of type ${file.type}`)

      const metadata = await mmb.parseBlob(file)
      console.log(metadata)
    }
  }
  return (
    <>
      <div>
        <button onClick={test}>testbutton</button>
        <br />
        adsfs
        <form>
          <input type="file" accept="audio/*" ref={inputRef} />
        </form>
      </div>
    </>
  )
}

export default Upload
