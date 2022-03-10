import { DefaultTheme } from 'styled-components'

const size = {
  mobile: '480px',
  tablet: '768px',
  desktop: '1200px',
}

const device = {
  mobile: `@media only screen and (max-width: ${size.mobile})`,
  tablet: `@media only screen and (max-width: ${size.tablet})`,
  desktop: `@media only screen and (max-width: ${size.desktop})`,
}

const colors = {
  accentColor: '#FFC107',
}

const lightThemeColors = {
  ...colors,
  primaryText: '#212121',
  secondaryText: '#757575',
  primaryColor: '#303F9F',
  secondaryColor: '#3F51B5',
  background: '#fff',
  borderColor: '#BDBDBD',
}

const darkThemeColors = {
  ...colors,
  primaryText: '#fff',
  secondaryText: '#BDBDBD',
  primaryColor: '#3F51B5',
  secondaryColor: '#C5CAE9',
  background: '#212121',
  borderColor: '#757575',
}

export const lightTheme: DefaultTheme = {
  colors: lightThemeColors,
  device,
}

export const darkTheme: DefaultTheme = {
  colors: darkThemeColors,
  device,
}
