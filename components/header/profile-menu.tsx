import { Menu, Transition } from '@headlessui/react'
import cn from 'classnames'
import { FC, Fragment, forwardRef, ReactNode, Ref } from 'react'
import { ChevronDownIcon, UserIcon } from '@heroicons/react/solid'
import Link from 'next/link'
import { signOut, useSession } from "next-auth/react"
import { LogoutIcon } from '@heroicons/react/outline'

const menuItems = [
	{ name: 'Account', path: '/profile' },
] as const

function className(active: boolean) {
	return cn({ 'bg-highlight text-t-highlight': active }, 'block px-4 py-2 text-sm text-primary transition-colors')
}

const MyLink = forwardRef((props: { href: string, children: ReactNode, [key: string]: any }, ref: Ref<HTMLAnchorElement>) => {
	const { href, children, ...rest } = props
	return (
		<Link href={href} ref={ref} {...rest}>
			{children}
		</Link>
	)
})
MyLink.displayName = 'MyLink'

type ProfileMenuProps = {
	isAdmin?: boolean
}

const ProfileMenu: FC<ProfileMenuProps> = ({ isAdmin }) => {
	const { data } = useSession()

	return (
		<Menu as="div" className="ml-3 relative">
			<div>
				<Menu.Button className="flex items-center">
					<span className="sr-only">Open user menu</span>
					<div className={cn(!isAdmin ? "bg-secondary" : "bg-primary", "p-1.5 flex text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-white")}>
						<UserIcon className={cn(!isAdmin ? "text-primary": "text-secondary","w-7 h-7")} />
					</div>
					<ChevronDownIcon className={cn(!isAdmin ? "text-secondary": "text-primary", "w-4 h-4")} />
				</Menu.Button>
			</div>
			<Transition
				as={Fragment}
				enter="transition ease-out duration-100"
				enterFrom="transform opacity-0 scale-95"
				enterTo="transform opacity-100 scale-100"
				leave="transition ease-in duration-75"
				leaveFrom="transform opacity-100 scale-100"
				leaveTo="transform opacity-0 scale-95"
			>
				<Menu.Items className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-secondary ring-1 ring-black ring-opacity-5 focus:outline-none">
					{menuItems.map(e => (
						<Menu.Item key={e.name}>
							{({ active }: { active: boolean }) => (
								<MyLink href={e.path} active={active.toString()}>
									<p className={className(active)} >
										{e.name}
									</p>
								</MyLink>
							)}
						</Menu.Item>
					))}
					<hr className="border-highlight mx-2 my-1" />
					<p className="mt-3 px-4 text-accent-1 text-sm" style={{ wordBreak: 'break-all' }}>{data?.user.email}</p>
					<Menu.Item>
						{({ active }: { active: boolean }) => (
							<button onClick={() => signOut({ callbackUrl: '/' })} className={cn('cursor-pointer', className(active))}>
								<LogoutIcon className="w-5 h-5 inline mr-1" />
								<span className="translate-y-[0.75px]">Log out</span>
							</button>
						)}
					</Menu.Item>
				</Menu.Items>
			</Transition>
		</Menu>
	)
}

export default ProfileMenu
