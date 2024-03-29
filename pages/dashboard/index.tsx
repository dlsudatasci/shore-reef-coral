import LoadingSpinner from '@components/loading-spinner'
import { useRetriever } from '@lib/useRetriever'
import { NextPage } from 'next'
import { useSession } from 'next-auth/react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import DashboardLayout from '@components/layouts/dashboard-layout'
import SurveyList from '@components/survey-list'
import Link from 'next/link'
import { Camera } from '@components/icons'
import { UserTeamsAPI } from '@pages/api/me/teams'
import { onUnauthenticated } from '@lib/utils'
import { DashboardHeader } from '@components/dashboard-header'
import { useUserOnlyAccess } from '@lib/useRoleAccess'

const Dashboard: NextPage = () => {
	const router = useRouter()
	const { status } = useSession({
		required: true,
		onUnauthenticated: onUnauthenticated(router)
	})
	const { data: teams } = useRetriever<UserTeamsAPI[]>(`/me/teams`)

	useUserOnlyAccess()

	if (status == 'loading') {
		return <DashboardLayout><LoadingSpinner className="main-height" borderColor="border-secondary" /></DashboardLayout>
	}

	return (
		<DashboardLayout>
			<Head>
				<title>Reef Mo | Dashboard</title>
			</Head>
			<DashboardHeader text="Dashboard" />
			{teams?.length ?
				<SurveyList className="mt-8 mb-20" teams={teams} />
				:
				<div className="rounded-md bg-highlight flex items-center px-6 py-3 mt-8">
					<Camera className="fill-primary w-12 hidden sm:block mr-5" />
					<h3 className="flex-1 text-t-highlight md:text-2xl text-base font-comic-cat">You are not yet in a volunteer team!</h3>
					<Link className="btn primary" href="/teams">Join a Team</Link>
				</div>
			}
		</DashboardLayout>
	)
}

export default Dashboard
