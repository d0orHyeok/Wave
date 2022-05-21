const caculateDateAgo = (value: string | number | Date) => {
  const today = new Date()
  const timeValue = new Date(value)

  const betweenSec = Math.floor((today.getTime() - timeValue.getTime()) / 1000)

  if (betweenSec < 60) {
    return `${betweenSec} secs ago`
  }

  const betweenTime = Math.floor(betweenSec / 60)
  if (betweenTime < 60) {
    return `${betweenTime} mins ago`
  }

  const betweenTimeHour = Math.floor(betweenTime / 60)
  if (betweenTimeHour < 24) {
    return `${betweenTimeHour} hours ago`
  }

  const betweenTimeDay = Math.floor(betweenTime / 60 / 24)
  if (betweenTimeDay < 365) {
    return `${betweenTimeDay} days ago`
  }

  return `${Math.floor(betweenTimeDay / 365)} years ago`
}

export default caculateDateAgo
