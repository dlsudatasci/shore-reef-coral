import { DashboardHeader } from '@components/dashboard-header'
import DashboardLayout from '@components/layouts/dashboard-layout'
import { RequestTable } from '@components/request-table'
import { useUserOnlyAccess } from '@lib/useRoleAccess'
import { onUnauthenticated } from '@lib/utils'
import { NextPage } from 'next'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'

const Page: NextPage = () => {
	const router = useRouter()
	const id = router.query.id
	useSession({
		required: true,
		onUnauthenticated: onUnauthenticated(router)
	})
	useUserOnlyAccess()


	return (
		<DashboardLayout>
			<DashboardHeader text="Manage Team" />

			{id && <RequestTable teamId={id.toString()} className="w-full mt-4" />}
		</DashboardLayout>
	)
}

export default Page