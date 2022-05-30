// 초단위 시간을 0:00 의 형식의 문자로 반환
const convertTimeToString = (time?: number) => {
  if (!time) {
    return '0:00'
  }

  const hours = Math.floor(time / 3600)
  const minutes = Math.floor((time % 3600) / 60)
  const seconds = Math.floor(time % 60)

  console.log(hours, minutes, seconds)

  let stringTime = !hours ? '' : `${hours}:${minutes < 10 ? '0' : ''}`
  console.log('hour', stringTime)
  stringTime += !minutes ? '' : `${minutes}:${seconds < 10 ? '0' : ''}`
  console.log('minutes', stringTime)
  stringTime = stringTime + seconds
  console.log('seconds', stringTime)

  return stringTime
}

export default convertTimeToString
