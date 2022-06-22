import { NextPage } from 'next';
import { signIn, useSession } from 'next-auth/react'
import Image from 'next/image';
import { useRouter } from 'next/router';
import DashboardLayout from '../../components/dashboard-bg';

const Dashboard: NextPage = () => {
	const { status } = useSession()
	const router = useRouter()

	if (status == 'unauthenticated') {
		router.replace('/login?from=/dashboard')
	}

	return (
		<DashboardLayout>
			<div className="flex">
				<Image className="mr-4" src="/mask-light.png" alt="Mask Icon" width={50} height={50} />
				<h1 className="font-comic-cat text-secondary">Dashboard</h1>
			</div>
		</DashboardLayout>
	)
}

export default Dashboard
