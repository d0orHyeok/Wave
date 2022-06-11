const sortByCreatedAt = (array: any[]) => {
  const sortedArray = array.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  )
  return sortedArray
}

export default sortByCreatedAt
