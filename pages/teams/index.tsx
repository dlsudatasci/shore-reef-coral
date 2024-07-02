import DashboardLayout from '@components/layouts/dashboard-layout'
import { PlusIcon } from '@heroicons/react/outline'
import { NextPage } from 'next'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useRetriever } from '@lib/useRetriever'
import { TeamsTable } from '@components/teams-table'
import { TeamProfileSummary } from '@pages/api/teams'
import { useUserOnlyAccess } from '@lib/useRoleAccess'

const TeamsPage: NextPage = () => {
	const router = useRouter()
	const { data: teams } = useRetriever<TeamProfileSummary[]>('/teams?filter=joinable', [])
	const { data: pending } = useRetriever<TeamProfileSummary[]>('/teams?filter=pending', [])

	useSession({
		required: true, 
		onUnauthenticated() {
			router.replace('/login?from=/teams')
		}, 
	})
	useUserOnlyAccess()


	return (
		<DashboardLayout>
			<div className="flex justify-between mt-16 mb-8">
				<h3 className="text-secondary text-3xl font-comic-cat">Pending applications</h3>
			</div>
			{
				pending.length == 0 ?
					<p className="text-center text-secondary text-4xl mt-24">You haven't applied for any teams.</p>
					:
					<>
					<p className="col-span-full text-secondary font-comic-cat">filters</p>
					<TeamsTable data={pending} />
					</>
			}
			<div className="flex justify-between mt-16 mb-8">
				<h3 className="text-secondary text-3xl font-comic-cat">Join a team</h3>
				<Link className="btn highlight" href="/teams/create">
					<PlusIcon className="aspect-square w-5 inline mr-1" />
					<span className="leading-none">Create a team</span>
				</Link>
			</div>
			{
				teams.length == 0 ?
					<p className="text-center text-secondary text-4xl mt-24">No teams available.</p>
					:
					<>
					<p className="col-span-full text-secondary font-comic-cat">filters</p>
					<TeamsTable data={teams} />
					</>
			}
		</DashboardLayout>
	)
}

export default TeamsPage
