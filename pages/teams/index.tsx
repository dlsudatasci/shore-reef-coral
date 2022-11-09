import DashboardLayout from '@components/layouts/dashboard-layout'
import { PlusIcon } from '@heroicons/react/outline'
import { NextPage } from 'next'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useRetriever } from '@lib/useRetriever'
import TeamsTable from '@components/teams-table'
import { TeamProfileSummary } from '@pages/api/teams'

const TeamsPage: NextPage = () => {
	const router = useRouter()
	const { data: teams } = useRetriever<TeamProfileSummary[]>('/teams', [])
	useSession({
		required: true,
		onUnauthenticated() {
			router.replace('/login?from=/teams')
		},
	})

	return (
		<DashboardLayout>
			<div className="flex justify-between mt-16 mb-8">
				<h3 className="text-secondary text-3xl font-comic-cat">Join a team</h3>
				<Link href="/teams/create">
					<a className="btn highlight">
						<PlusIcon className="aspect-square w-5 inline mr-1" />
						<span className="leading-none">Create a team</span>
					</a>
				</Link>
			</div>
			<TeamsTable data={teams} />
		</DashboardLayout>
	)
}

export default TeamsPage