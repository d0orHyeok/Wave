import FastAverageColor from 'fast-average-color'

const getGradientFromImageUrl = async (
  url: string,
  defaultGradient: string
) => {
  const fac = new FastAverageColor()
  try {
    // 이미지의 평균주색
    const primary = await fac.getColorAsync(url)
    // 이미지의 평균보조색
    const secondary = await fac.getColorAsync(url, {
      algorithm: 'dominant',
    })
    const newbackground = `
              background: ${secondary.rgb};
              background: linear-gradient(
                135deg,
                ${secondary.rgba} 0%,
                ${primary.rgba} 100%
              );
          `
    return newbackground
  } catch (error) {
    console.log(error)
    return defaultGradient
  }
}

export default getGradientFromImageUrl
