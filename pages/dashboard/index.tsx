import LoadingSpinner from '@components/loading-spinner'
import { useRetriever } from '@lib/useRetriever'
import { NextPage } from 'next'
import { useSession } from 'next-auth/react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import DashboardLayout from '@components/layouts/dashboard-layout'
import SurveyList from '@components/survey-list'
import Link from 'next/link'
import Laptop from '@components/icons/laptop'
import Camera from '@components/icons/camera'
import { UserTeamsAPI } from '@pages/api/users/[id]/teams'

const Dashboard: NextPage = () => {
	const router = useRouter()
	const { status, data } = useSession({
		required: true,
		onUnauthenticated() {
			router.replace('/login?error=Please login to continue.')
		},
	})
	const { data: teams } = useRetriever<UserTeamsAPI[]>(data ? `/users/${data.user.id}/teams` : null, [])

	if (status == 'loading') {
		return <DashboardLayout><LoadingSpinner className="main-height" borderColor="border-secondary" /></DashboardLayout>
	}

	return (
		<DashboardLayout>
			<Head>
				<title>Reef Mo | Dashboard</title>
			</Head>
			<div className="grid place-items-center mt-20">
				<div className="flex items-center border-secondary border py-4 px-2">
					<h1 className="mr-4 font-comic-cat text-secondary">Dashboard</h1>
					<Laptop className="w-14 fill-secondary" />
				</div>
			</div>
			{teams.length !== 0 ?
				<SurveyList className="mt-8" teams={teams} />
				:
				<div className="rounded-md bg-highlight flex items-center px-6 py-3 mt-8">
					<Camera className="fill-primary w-12 hidden sm:block" />
					<h3 className="flex-1 text-t-highlight md:text-2xl text-base font-comic-cat">You are not yet in a volunteer team!</h3>
					<Link className="btn primary" href="/teams">Join a Team</Link>
				</div>
			}
		</DashboardLayout>
	)
}

export default Dashboard
