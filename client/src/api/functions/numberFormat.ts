const numberFormat = (number: number) => {
  if (number < 1000) {
    return `${number}`
  }

  const k = Math.floor(number / 1000)
  if (k < 1000) {
    return `${k}k`
  }

  const m = Math.floor(k / 1000)
  return `${m}m`
}

export default numberFormat
