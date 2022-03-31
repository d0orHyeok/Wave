import { DefaultTheme } from 'styled-components'

const size = {
  mobile: '480px',
  tablet: '800px',
  desktop: '1200px',
}

const device = {
  mobile: `@media only screen and (max-width: ${size.mobile})`,
  tablet: `@media only screen and (max-width: ${size.tablet})`,
  desktop: `@media only screen and (max-width: ${size.desktop})`,
}

const colors = {
  primaryVariantColor: '#3700B3',
  secondaryColor: '#03DAC6',
  secondaryText: '#000',
  errorText: '#000',
}

const lightThemeColors = {
  ...colors,
  primaryColor: '#6200EE',
  bgColor: '#FFF',
  bgColorRGB: '255, 255, 255',
  bgColorRGBA: (opacity: string | number) => `rgba(18, 18, 18, ${opacity})`,
  errorColor: '#B00020',
  primaryText: '#FFF',
  bgText: '#000',
  bgTextRGBA: (opacity: string | number) => `rgba(0, 0, 0, ${opacity})`,
  border1: 'rgba(0, 0, 0,0.15) ',
  border2: 'rgba(0,0,0, 0.38)',
}

const darkThemeColors = {
  ...colors,
  primaryColor: '#BB86FC',
  bgColor: '#121212',
  bgColorRGB: '18, 18, 18',
  bgColorRGBA: (opacity: string | number) => `rgba(255, 255, 255, ${opacity})`,
  errorColor: '#CF6679',
  primaryText: '#000',
  bgText: '#FFF',
  bgTextRGBA: (opacity: string | number) => `rgba(255, 255, 255, ${opacity})`,
  border1: 'rgba(255, 255, 255,0.15) ',
  border2: 'rgba(255,255,255, 0.38)',
}

export const lightTheme: DefaultTheme = {
  colors: lightThemeColors,
  device,
}

export const darkTheme: DefaultTheme = {
  colors: darkThemeColors,
  device,
}
