import { NextPage } from 'next';
import { useSession } from 'next-auth/react'
import Head from 'next/head'
import Image from 'next/image';
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';
import Card from '../../components/card';
import DashboardLayout from '../../components/layouts/dashboard-layout';
import { toastErrorConfig } from '../../lib/toast-defaults';

const Dashboard: NextPage = () => {
	const router = useRouter()
	useSession({
		required: true,
		onUnauthenticated() {
			toast.error('Please login to continue.', toastErrorConfig)
			router.replace('/login')
		},
	})

	return (
		<DashboardLayout>
			<Head>
				<title>Reef Mo | Dashboard</title>
			</Head>
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
