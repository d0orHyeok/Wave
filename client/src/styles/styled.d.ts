// import original module declarations
import 'styled-components'

// and extend them!
declare module 'styled-components' {
  export interface DefaultTheme {
    colors: Colors
    device: Device
  }
}

interface Colors {
  primaryText: string
  secondaryText: string
  primaryColor: string
  secondaryColor: string
  background: string
  borderColor: string
  accentColor: string
}

interface Device {
  mobile: string
  tablet: string
  desktop: string
}
