import Head from 'next/head'
import { FC } from 'react'
import Header from './header/'
import ScrollToTop from './scroll-to-top'

export const siteTitle = 'Reef Mo'

const Layout: FC<{ children: React.ReactNode }> = ({ children }) => {
	return (
		<>
			<Head>
				<link rel="icon" href="/clam-light.png" />
				<title>{siteTitle}</title>
				<meta
					name="description"
					content="Submit Philippine coral reef surveys to help monitor our country's precious natural aquatic habitats."
				/>
				<meta
					property="og:image"
					content={`https://og-image.vercel.app/${encodeURI(
						siteTitle
					)}.png?theme=light&md=0&fontSize=75px&images=https%3A%2F%2Fassets.vercel.com%2Fimage%2Fupload%2Ffront%2Fassets%2Fdesign%2Fnextjs-black-logo.svg`}
				/>
				<meta name="theme-color" content="#17829F" />
				<meta name="og:title" content={siteTitle} />
				<meta name="twitter:card" content="summary_large_image" />
			</Head>
			<Header />
			<main className="main-height grid">
				{children}
			</main>
			<ScrollToTop />
		</>
	)
}

export default Layout
