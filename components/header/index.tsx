import { FC } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { Disclosure, Transition } from '@headlessui/react'
import { MenuIcon, XIcon } from '@heroicons/react/outline'
import { useSession } from "next-auth/react"
import ProfileMenu from './profile-menu'
import cn from 'classnames'

interface NavItemProp {
	text: string
	path: string
	isHome?: boolean
	status?: 'authenticated' | 'unauthenticated'
	isAdmin?: boolean
}

interface MobNavItemProp extends NavItemProp {
	onClick: () => void
}

export const navItems: NavItemProp[] = [
	{ path: '/about', text: 'About' },
	{ path: '/surveys/submit', text: 'Submit a survey' },
	{ path: '/lessons', text: 'Lessons' },
	{ path: '/dashboard', text: 'Dashboard', status: 'authenticated' },
	{ path: '/admin/teams', text: 'Teams', status: 'authenticated', isAdmin: true },
	{ path: '/admin/surveys', text: 'Surveys', status: 'authenticated', isAdmin: true },
]

const MobNavItem: FC<MobNavItemProp> = ({ text, path, onClick }) => {
	const { pathname } = useRouter()

	return (
		<Link href={path} onClick={onClick}
			className='border-l-2 block px-3 py-2 text-base font-medium cursor-pointer' aria-current={pathname === path ? 'page' : undefined}>
			{text}
		</Link>
	)
}

const NavItem: FC<NavItemProp> = ({ text, path, isAdmin }) => {
	const { pathname } = useRouter()

	return (
		<Link href={path} className={cn(!isAdmin ? "text-secondary": "text-primary", "font-comic-cat text-xl h-full inline-flex justify-center items-center cursor-pointer")}>
			<p className="px-3 py-2" aria-current={path === pathname ? 'page' : undefined}>{text}</p>
		</Link>
	)
}

const Header: FC = () => {
	const { status, data } = useSession()
	const isAdmin = data?.user?.isAdmin

	return (
		<header className="h-[6.25rem] relative z-50">
			<Disclosure as="nav" className={cn(!isAdmin ? "bg-primary" : "bg-secondary","h-full")}>
				{({ open, close }) => (
					<>
						<div className="container mx-auto px-2 sm:px-6 lg:px-8 h-full">
							<div className="relative flex items-center justify-between h-full">
								<div className="absolute inset-y-0 left-0 flex items-center lg:hidden">
									<Disclosure.Button className="inline-flex items-center justify-center p-2 rounded-md text-secondary hover:text-primary hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-inset focus:ring-secondary" aria-controls="mobile-menu" aria-expanded="false">
										<span className="sr-only">Open main menu</span>
										{open ? <XIcon className="block h-6 w-6" aria-hidden="true" /> : <MenuIcon className="block h-6 w-6" aria-hidden="true" />}
									</Disclosure.Button>
								</div>

								<div className="flex-1 lg:flex-grow-0 flex items-center h-full justify-center lg:items-stretch lg:justify-start">
									<Link href="/" className="flex">
										<div className="flex-shrink-0 flex items-center cursor-pointer mr-6">
											<Image src="/logo-alwan.png" alt="SHORE Logo" width={260} height={70} />
										</div>
									</Link>
								</div>
								<div className="hidden lg:block absolute left-1/2 -translate-x-1/2">
									<div className="flex space-x-4 items-center h-full">
										{/* TODO: refactor this */}
										{!isAdmin ? navItems.flatMap(nav => nav.status === undefined || nav.status === status && !nav.isAdmin  ?
											<NavItem key={nav.text} text={nav.text} path={nav.path} isHome={nav.isHome}  /> : []
										) : navItems.flatMap(nav => nav.isAdmin !== undefined || nav.isAdmin === isAdmin  ?
											<NavItem key={nav.text} text={nav.text} path={nav.path} isHome={nav.isHome} isAdmin={isAdmin}  /> : [] )}
									</div>
								</div>
								<div className="absolute inset-y-0 right-0 flex items-center pr-2 lg:static lg:inset-auto lg:ml-6 lg:pr-0">
									{status === 'authenticated' ?
										<ProfileMenu isAdmin={isAdmin} />
										:
										<div className="hidden lg:contents">
											<Link type="button" className="font-comic-cat mr-4 text-xl text-secondary" href="/login">
												Login
											</Link>
											<Link type="button" className="btn secondary h-auto py-1.5" href="/register">
												Sign Up
											</Link>
										</div>
									}
								</div>
							</div>
						</div>

						<Transition
							enter="transition duration-100 ease-out"
							enterFrom="transform scale-95 opacity-0"
							enterTo="transform scale-100 opacity-100"
							leave="transition duration-75 ease-out"
							leaveFrom="transform scale-100 opacity-100"
							leaveTo="transform scale-95 opacity-0"
						>

							<Disclosure.Panel className="lg:hidden relative bg-white">
								<div className="px-2 pt-2 pb-3 space-y-1">
									{navItems.map(nav => <MobNavItem key={nav.text} text={nav.text} path={nav.path} isHome={nav.isHome} onClick={close} />)}
									{status !== 'authenticated' &&
										<>
											<MobNavItem text="Login" path="/login" onClick={close} />
											<MobNavItem text="Sign Up" path="/register" onClick={close} />
										</>
									}
								</div>
							</Disclosure.Panel>
						</Transition>
					</>
				)}
			</Disclosure>
		</header>
	)
}

export default Header