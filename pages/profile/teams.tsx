import { PlusIcon } from '@heroicons/react/outline'
import { NextPage } from 'next'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useRetriever } from '@lib/useRetriever'
import { TeamsTable } from '@components/teams-table'
import { TeamProfileSummary } from '@pages/api/teams'
import { useUserOnlyAccess } from '@lib/useRoleAccess'
import ProfileLayout from '@components/layouts/profile-layout'

const TeamsPage: NextPage = () => {
	const router = useRouter()
	const { data: teams } = useRetriever<TeamProfileSummary[]>('/teams?filter=joined', [])

	useSession({
		required: true,
		onUnauthenticated() {
			router.replace('/login?from=/teams')
		},
	})
	useUserOnlyAccess()


	return (
		<ProfileLayout>
			<div className='bg-secondary rounded-lg p-8'>
				<div className="flex justify-between mb-8 ">
					<h3 className="text-primary text-3xl font-comic-cat">My Teams</h3>
					<Link className="btn highlight" href="/teams/create">
						<PlusIcon className="aspect-square w-5 inline mr-1" />
						<span className="leading-none">Create a team</span>
					</Link>
				</div>
				{
					teams.length == 0 ?
						<p className="text-center text-primary text-4xl mt-24">No teams available.</p>
						:
						<TeamsTable data={teams} filter={'joined'} />
				}
			</div>
		</ProfileLayout>
	)
}

export default TeamsPage
