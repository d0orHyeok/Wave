// 초단위 시간을 0:00 의 형식의 문자로 반환
const convertTimeToString = (time?: number) => {
  if (!time) {
    return '0:00'
  }

  const hours = Math.floor(time / 3600)
  const minutes = Math.floor((time % 3600) / 60)
  const seconds = Math.floor(time % 60)

  let stringTime = !hours ? '' : `${hours}:`
  stringTime +=
    (stringTime.length ? `${minutes < 10 ? '0' : ''}` : '') + `${minutes}:`
  stringTime = stringTime + (seconds < 10 ? `0${seconds}` : seconds)

  return stringTime
}

export default convertTimeToString
