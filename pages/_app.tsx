import '../styles/globals.css'
import 'react-toastify/dist/ReactToastify.min.css'
import type { AppProps } from 'next/app'
import Layout from '../components/layouts/layout'
import { SessionProvider } from "next-auth/react"
import { ToastContainer } from 'react-toastify'
import { Session } from 'next-auth'
import { ParallaxProvider } from 'react-scroll-parallax'

function MyApp({
	Component,
	pageProps: { session, ...pageProps }
}: AppProps<{
	session: Session
}>) {
	return (
		<SessionProvider session={session}>
			<ParallaxProvider>
				<Layout>
					<Component {...pageProps} />
				</Layout>
				<ToastContainer />
			</ParallaxProvider>
		</SessionProvider>
	)
}

export default MyApp
