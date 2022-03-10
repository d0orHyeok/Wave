import { createGlobalStyle } from 'styled-components'
import { reset } from 'styled-reset'

export const GlobalStyle = createGlobalStyle`
    ${reset}
    body {
        font-family: Laferi;
    }
    h1,h2,h3,h4,h5,h6 {
        font-family: LaferiBold;
    }
    .logo {
        font-family: LaferiSpecial;
    }
    button {
        font-family: inherit;
    }
    a {
        font-family: inherit;
        text-decoration: inherit;
        color: inherit;
    }
  
`
