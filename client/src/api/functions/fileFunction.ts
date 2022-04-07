export const fileToUint8Array = async (file: File) => {
  const ab = await file.arrayBuffer()
  return new Uint8Array(ab)
}

export const getCoverUrlFromMetadata = (
  data: Buffer | Uint8Array,
  type: string
) => {
  const blob = new Blob([data], { type })
  return URL.createObjectURL(blob)
}
