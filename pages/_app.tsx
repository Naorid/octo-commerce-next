import { AppProps } from 'next/app'
import {ChakraProvider, extendTheme} from "@chakra-ui/react";

const theme = extendTheme({
    styles: {
      global: {
        body: {
          bg: '#0e2356',
          color: 'white',
        },
        a: {
          color: 'white',
          _hover: {
            textDecoration: 'underline',
          },
        },
      },
    },
  })

const App = ({ Component, pageProps }: AppProps) => {
    return (
        <ChakraProvider theme={theme}>
            <br /><br /><br />
            <Component { ...pageProps} />
        </ChakraProvider>
    )
}

export default App
