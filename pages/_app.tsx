import type { AppProps } from 'next/app'
import 'styles/index.css'
import Analytics from 'components/Analytics'
import { ToastContainer } from 'react-toastify'

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Component {...pageProps} />
      <ToastContainer />
      <Analytics />
    </>
  )
}
