import Head from 'next/head'
import { FC } from 'react'
import Header from './header'
import ScrollToTop from './scroll-to-top'

export const siteTitle = 'CBRACT2 Portal'

const Layout: FC<{ children: React.ReactNode }> = ({ children }) => {
	return (
		<>
			<Head>
				<link rel="icon" href="/favicon.ico" />
				<title>{siteTitle}</title>
				<meta
					name="description"
					content="A society of volunteer students who are willing to serve as tutors to students who need academic assistance."
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
			<footer className="text-gray-500 h-20 md:h-30 px-4 md:px-8">
				<div className="flex justify-between items-center min-h-full mx-auto container">
					
				</div>
			</footer>

			<ScrollToTop />
		</>
	)
}

export default Layout
