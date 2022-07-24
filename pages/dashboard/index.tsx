import LoadingSpinner from '@components/loading-spinner'
import { NextPage } from 'next'
import { useSession } from 'next-auth/react'
import Head from 'next/head'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { toast } from 'react-toastify'
import DashboardLayout from '../../components/layouts/dashboard-layout'
import SurveyList from '../../components/survey-list'
import { toastErrorConfig } from '../../lib/toast-defaults'

const Dashboard: NextPage = () => {
	const router = useRouter()
	const { status } = useSession({
		required: true,
		onUnauthenticated() {
			toast.error('Please login to continue.', toastErrorConfig)
			router.replace('/login')
		},
	})

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
				<h2 className="text-secondary font-comic-cat mt-8">Team Name</h2>
			</div>
			<SurveyList className="mt-8" />
		</DashboardLayout>
	)
}

export default Dashboard
