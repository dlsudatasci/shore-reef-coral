import Head from 'next/head'
import { FC } from 'react'
import Header from '../header'
import ScrollToTop from '../scroll-to-top'
import { navItems } from '../header'
import Link from 'next/link'
import Image from 'next/image'
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
				<div className="flex justify-between container mx-auto flex-wrap space-y-8">
					<div className="grid grid-flow-col gap-x-4">
						<div className="grid pr-2 self-start">
							{navItems.flatMap(nav => (
								nav.status == undefined || nav.status == status ?
									<Link key={nav.path} href={nav.path}>
										<a>{nav.text}</a>
									</Link>
									:
									[]
							))}
						</div>
						<div className="text-secondary pl-4 border-l-2 border-secondary max-w-sm">
							<p>Br. Alfred Shields FSC Ocean Research (SHORE) Center</p>
							<p>shorecenter@dlsu.edu.ph</p>
							<p>524-4611 loc. 426</p>
							<p>
								3F Henry Sy Sr. Hall
								De La Salle University
								2401 Taft Avenue, Malate, Manila
							</p>
						</div>
					</div>
					<div className="text-secondary flex flex-col justify-end space-y-2 text-center sm:text-right w-full sm:w-auto">
						<div className="flex justify-center">
							<Image src="/logos/DLSU.png" width={45} height={45} alt="DLSU Logo" />
							<Image src="/logos/DSI.png" width={45} height={45} alt="DSI Logo" />
							<Image src="/logos/SHORE.png" width={45} height={45} alt="SHORE Logo" />
							<Image src="/logos/DOST.png" width={45} height={45} alt="DOST Logo" />
						</div>
						<p>Copyright {new Date().getFullYear()}</p>
					</div>
				</div>
			</footer>
			<ScrollToTop />
		</>
	)
}

export default Layout
