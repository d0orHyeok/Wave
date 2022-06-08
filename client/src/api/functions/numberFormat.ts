const numberFormat = (number: number) => {
  if (number < 1000) {
    return `${number}`
  }

  const k = number / 1000
  if (k < 1000) {
    return `${k.toFixed(1)}K`
  }

  const m = k / 1000
  return `${m.toFixed(2)}M`
}

export default numberFormat
