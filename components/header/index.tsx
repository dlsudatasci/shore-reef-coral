import { FC } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { Disclosure, Transition } from '@headlessui/react'
import { MenuIcon, XIcon } from '@heroicons/react/outline'
import { useSession } from "next-auth/react"
import ProfileMenu from './profile-menu'

interface NavItemProp {
	text: string
	path: string
	isHome?: boolean
}

interface MobNavItemProp extends NavItemProp {
	onClick: () => void
}

const navItems: NavItemProp[] = [
	{ path: '/about', text: 'about' },
	{ path: '/contribute', text: 'how to contribute' },
]

const MobNavItem: FC<MobNavItemProp> = ({ text, path, isHome, onClick }) => {
	const { pathname } = useRouter()

	return (
		<Link href={path}>
			<a className='border-l-4 block px-3 py-2 text-base font-medium cursor-pointer' aria-current={pathname == path ? 'page' : undefined} onClick={onClick}>{text}</a>
		</Link>
	)
}

const NavItem: FC<NavItemProp> = ({ text, path, isHome }) => {
	const { pathname } = useRouter()

	return (
		<Link href={path} passHref>
			<a className="font-comic-cat text-secondary text-xl h-full inline-flex justify-center items-center cursor-pointer">
				<p className="px-3 py-2" aria-current={path == pathname ? 'page' : undefined}>{text}</p>
			</a>
		</Link>
	)
}

const Header: FC = () => {
	const { status } = useSession()

	return (
		<header className="h-[6.25rem] relative z-50">
			<Disclosure as="nav" className="bg-primary h-full">
				{({ open, close }) => (
					<>
						<div className="container mx-auto px-2 sm:px-6 lg:px-8 h-full">
							<div className="relative flex items-center justify-between h-full">
								<div className="absolute inset-y-0 left-0 flex items-center md:hidden">
									<Disclosure.Button className="inline-flex items-center justify-center p-2 rounded-md text-secondary hover:text-primary hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-inset focus:ring-secondary" aria-controls="mobile-menu" aria-expanded="false">
										<span className="sr-only">Open main menu</span>
										{open ? <XIcon className="block h-6 w-6" aria-hidden="true" /> : <MenuIcon className="block h-6 w-6" aria-hidden="true" />}
									</Disclosure.Button>
								</div>

								<div className="flex-1 md:flex-grow-0 flex items-center h-full justify-center md:items-stretch md:justify-start">
									<Link href="/" passHref>
										<div className="flex-shrink-0 flex items-center cursor-pointer mr-6">
											<Image className="block w-auto" src="/logo-white.png" alt="SHORE Logo" width={80} height={80} />
										</div>
									</Link>
								</div>
								<div className="hidden md:block md:ml-6">
									<div className="flex space-x-4 items-center h-full">
										{navItems.map(nav => <NavItem key={nav.text} text={nav.text} path={nav.path} isHome={nav.isHome} />)}
										{status == 'authenticated' && <NavItem text="Dashboard" path="/dashboard" />}
									</div>
								</div>
								<div className="absolute inset-y-0 right-0 flex items-center pr-2 md:static md:inset-auto md:ml-6 md:pr-0">
									{status == 'authenticated' ?
										<ProfileMenu />
										:
										<>
											<Link href='/login'>
												<a type="button" className="font-comic-cat mr-4 text-xl text-secondary">Login</a>
											</Link>
											<Link href='/register'>
												<a type="button" className="btn secondary h-auto py-1.5">Sign Up</a>
											</Link>
										</>
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

							<Disclosure.Panel className="md:hidden relative bg-white">
								<div className="px-2 pt-2 pb-3 space-y-1">
									{navItems.map(nav => <MobNavItem key={nav.text} text={nav.text} path={nav.path} isHome={nav.isHome} onClick={close} />)}
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