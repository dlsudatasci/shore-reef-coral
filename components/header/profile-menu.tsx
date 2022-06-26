import { Menu, Transition } from '@headlessui/react'
import cn from 'classnames'
import { FC, Fragment, forwardRef, ReactNode, Ref } from 'react'
import { UserIcon } from '@heroicons/react/solid'
import Link from 'next/link'
import { signOut, useSession } from "next-auth/react"

const menuItems = [
	{ name: 'Account', path: '/dashboard/profile' },
	{ name: 'Documentation', path: '/dashboard/documentation' },
] as const

function className(active: boolean) {
	return cn({ 'bg-highlight text-t-highlight': active }, 'block px-4 py-2 text-sm text-primary')
}

const MyLink = forwardRef((props: { href: string, children: ReactNode, [key: string]: any }, ref: Ref<HTMLAnchorElement>) => {
  let { href, children, ...rest } = props
  return (
    <Link href={href}>
      <a ref={ref} {...rest}>
        {children}
      </a>
    </Link>
  )
})
MyLink.displayName = 'MyLink'

const ProfileMenu: FC = () => {
	const { data } = useSession()
	
	return (
		<Menu as="div" className="ml-3 relative">
			<div>
				<Menu.Button className="bg-secondary p-1.5 flex text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-white">
					<span className="sr-only">Open user menu</span>
					<UserIcon className="w-7 h-7 text-primary" />
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
								<MyLink href={e.path} active={active}>
									<a className={className(active)} >
										{e.name}
									</a>
								</MyLink>
							)}
						</Menu.Item>
					))}
					<hr className="border-highlight mx-2 my-1" />
					<p className="mt-3 pl-4 text-accent-1 text-sm">{data?.user.email}</p>
					<Menu.Item>
						{({ active }: { active: boolean }) => (
							<a onClick={() => signOut({ callbackUrl: '/' })} className={cn('cursor-pointer', className(active))}>Log out</a>
						)}
					</Menu.Item>
				</Menu.Items>
			</Transition>
		</Menu>
	)
}

export default ProfileMenu
