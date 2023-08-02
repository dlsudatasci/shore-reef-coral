import Link from 'next/link'
import { FC, ReactNode } from 'react'
import DashboardLayout from './dashboard-layout'

const navItems = [
	{ name: 'Profile', path: '/profile' },
	{ name: 'Change password', path: '/profile/password' },
	{ name: 'Team information', path: '/profile/teams' },
] as const

const ProfileLayout: FC<{ children: ReactNode }> = ({ children }) => {
	return (
		<DashboardLayout>
			<div className="grid lg:grid-cols-6 mt-12 gap-y-8">
				<div>
					<h3 className="font-comic-cat text-secondary text-2xl mb-5">SETTINGS</h3>
					<nav>
						{navItems.map(e => (
							<Link className="block" key={e.name} href={e.path}>{e.name}</Link>
						))}
					</nav>
				</div>
				<div className="col-span-5">{children}</div>
			</div>
		</DashboardLayout>
	)
}

export default ProfileLayout
