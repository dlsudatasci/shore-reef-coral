import LoadingSpinner from '@components/loading-spinner'
import { useRetriever } from '@lib/useRetriever'
import { NextPage } from 'next'
import { useSession } from 'next-auth/react'
import Head from 'next/head'
import Image from 'next/image'
import { useRouter } from 'next/router'
import DashboardLayout from '@components/layouts/dashboard-layout'
import SurveyList from '@components/survey-list'
import { UsersOnTeams } from '@prisma/client'
import Link from 'next/link'

const Dashboard: NextPage = () => {
	const router = useRouter()
	const { status, data } = useSession({
		required: true,
		onUnauthenticated() {
			router.replace('/login?error=Please login to continue.')
		},
	})
	const { data: teams } = useRetriever<UsersOnTeams[]>(data ? `/users/${data.user.id}/teams` : null, [])

	if (status == 'loading') {
		return <DashboardLayout><LoadingSpinner className="main-height" borderColor="border-secondary" /></DashboardLayout>
	}

	return (
		<DashboardLayout>
			<Head>
				<title>Reef Mo | Dashboard</title>
			</Head>
			<div className="grid place-items-center mt-20">
				<div className="flex items-center border-secondary border px-8 py-4">
					<h1 className="mr-4 font-comic-cat text-secondary">Dashboard</h1>
					<Image src="/laptop-light.png" alt="Laptop Icon" width={60} height={60} />
				</div>
			</div>
			{teams.length !== 0 ?
				<>
					<h2 className="text-secondary font-comic-cat mt-8 text-center">Team Name</h2>
					<SurveyList className="mt-8" />
				</>
				:
				<div className="rounded-md bg-highlight flex items-center space-x-4 px-6 py-3 mt-8">
					<Image src="/camera-dark.png" alt="Camera Icon" width={50} height={50} />
					<h3 className="flex-1 text-t-highlight text-2xl font-comic-cat">You are not yet in a volunteer team!</h3>
					<Link href="/teams">
						<a className="btn primary">Join a Team</a>
					</Link>
				</div>
			}
		</DashboardLayout>
	)
}

export default Dashboard
