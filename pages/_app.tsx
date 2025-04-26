import Analytics from 'components/Analytics'
import { LoadingProvider } from 'context/LoadingContext'
import { ThemeProvider } from 'next-themes'
import type { AppProps } from 'next/app'
import { ToastContainer } from 'react-toastify'
import 'styles/index.css'

export default function MyApp({ Component, pageProps }: AppProps) {
 
  return (
    <>
      <ThemeProvider attribute="class">
        <LoadingProvider>
          <Component {...pageProps} />
        </LoadingProvider>
        <ToastContainer />
        <Analytics />
      </ThemeProvider>
    </>
  )
}
