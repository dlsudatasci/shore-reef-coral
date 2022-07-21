import Head from 'next/head'
import { FC } from 'react'
import Header from '../header'
import ScrollToTop from '../scroll-to-top'
import { navItems } from '../header'
import Link from 'next/link'
import { useSession } from 'next-auth/react'

export const siteTitle = 'Reef Mo'

const Layout: FC<{ children: React.ReactNode }> = ({ children }) => {
	const { status } = useSession()

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
			<footer className="bg-primary py-8 px-4">
				<div className="flex justify-between container mx-auto">
					<div className="grid grid-cols-2 gap-x-4">
						<div className="grid border-r-2 border-secondary pr-6">
							{navItems.flatMap(nav => (
								nav.status == undefined || nav.status == status ?
									<Link key={nav.path} href={nav.path}>
										<a>{nav.text}</a>
									</Link>
									:
									[]
							))}
						</div>
						<div className="text-secondary">
							<p>Email</p>
							<p>Contact Number</p>
							<p>Address</p>
						</div>
					</div>
					<div className="text-secondary grid items-end">
						<p>Copyright {new Date().getFullYear()}</p>
					</div>
				</div>
			</footer>
			<ScrollToTop />
		</>
	)
}

export default Layout
