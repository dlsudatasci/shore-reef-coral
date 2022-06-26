import { NextPage } from 'next';
import { signIn, useSession } from 'next-auth/react'
import Image from 'next/image';
import { useRouter } from 'next/router';
import Card from '../../components/card';
import DashboardLayout from '../../components/layouts/dashboard-layout';

const Dashboard: NextPage = () => {
	const { status } = useSession()
	const router = useRouter()

	if (status == 'unauthenticated') {
		router.replace('/login?from=/dashboard')
	}

	return (
		<DashboardLayout>
			<div className="flex items-center mt-20">
				<Image src="/mask-light.png" alt="Mask Icon" width={60} height={60} />
				<h1 className="ml-4 font-comic-cat text-secondary">Dashboard</h1>
			</div>
			<h2 className="text-secondary font-comic-cat mt-8">Team Name</h2>
			<div className="grid md:grid-cols-3 gap-4 mt-12">
				<Card number={5} noun="Images" verb="Submitted" />
				<Card number={40} noun="Butterfly Fish" verb="Found" />
				<Card number={80} noun="Target Invertebrates" verb="Found	" />
			</div>
		</DashboardLayout>
	)
}

export default Dashboard
