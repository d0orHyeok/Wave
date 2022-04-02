// 초단위 시간을 0:00 의 형식의 문자로 반환
const convertTimeToString = (time?: number) => {
  if (!time) {
    return '0:00'
  }

  const minutes = Math.floor(time / 60)
  let seconds: number | string = Math.floor(time % 60)
  if (seconds < 10) {
    seconds = `0${seconds}`
  }
  const stringTime = `${minutes}:${seconds}`

  return stringTime
}

export default convertTimeToString
