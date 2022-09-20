import type { NextPage } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import styles from '@styles/Home.module.css'
import { useForm } from 'react-hook-form'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import app from '@lib/axios-config'
import { toast } from 'react-toastify'
import { toastErrorConfig, toastSuccessConfig } from '@lib/toast-defaults'
import WaveBG from '@components/wave-bg'
import GetInvolvedButton from '@components/get-involved-button'
import Laptop from '@components/icons/laptop'
import Mask from '@components/icons/mask'
import Coral from '@components/icons/coral'
import Camera from '@components/icons/camera'

const contactSchema = yup.object({
	name: yup.string().required('Name is required!'),
	email: yup.string().email().required('Email is required!'),
	message: yup.string().required('Message is required!')
})

export type ContactSchema = yup.InferType<typeof contactSchema>

async function onSubmit(data: ContactSchema) {
	try {
		await app.post('/contact-us', data)
		toast.success('Email was sent!', toastSuccessConfig)
	} catch {
		toast.error('An error has occurred', toastErrorConfig)
	}
}

const Home: NextPage = () => {
	const { register, handleSubmit, formState: { errors } } = useForm<ContactSchema>({
		resolver: yupResolver(contactSchema)
	})
	return (
		<div className={styles.home}>
			<div className="main-height relative">
				<Image src="/landing.jpg" alt="Diver taking pictures" layout="fill" objectFit="cover" objectPosition="top" />
				<WaveBG className="absolute -bottom-5 md:-bottom-8 lg:-bottom-10 xl:-bottom-16" />
			</div>
			<section>
				<div className="grid md:grid-cols-2 gap-x-8 gap-y-12">
					<div className="place-self-center">
						<div className={styles.header}>
							<h1>Reef Mo,</h1>
							<Mask className="fill-secondary w-16" />
						</div>
						<h1 className="-mt-4 mb-4">I-monitor mo!</h1>
						<p>
							Reef Mo is every citizen scientist&apos;s one-stop shop for reef monitoring in
							the Philippines. Here, we bring experts and citizen scientists together to study
							reefs, collaborate, and share reef survey data and learning materials.
						</p>
						<Link href="/surveys/submit">
							<a className="btn secondary w-72">Dive In</a>
						</Link>
					</div>
					<div className="relative">
						<Image src="/landing-1.jpg" layout="responsive" width="1920" height="1283" alt="A research team" objectFit="contain" />
					</div>
				</div>
				<div className="flex justify-center space-x-6 mx-auto mt-12">
					<div className={styles.logo} />
					<div className={styles.logo} />
					<div className={styles.logo} />
					<div className={styles.logo} />
				</div>
			</section>
			<section className={styles.secondary}>
				<div className="!max-w-2xl mx-auto">
					<div className="aspect-video col-span-full bg-primary mb-8">
					</div>
					<div className="grid sm:grid-cols-[3fr_7fr] items-start">
						<div className={styles.header}>
							<h1>About<br />Us</h1>
						</div>
						<div>
							<p>
								ReefMo aims to empower ordinary citizens to monitor their reefs using the
								Alwan methods and see results in real time. These methods were developed in
								cooperation between the academe, citizen scientists, and DOST-PCAARRD.
							</p>
							<Link href="/lessons">
								<a className="btn primary w-56">Dive Deeper</a>
							</Link>
						</div>
					</div>
				</div>
			</section>
			<section className="relative min-h-[50vh]">
				<Image src="/landing-2.jpg" alt="Diver" layout="fill" objectFit="cover" className="z-0" />
				<div className="grid place-items-center h-full relative z-10">
					<div className="max-w-md text-center grid justify-items-center gap-y-4">
						<h1>Become a<br />citizen scientist</h1>
						<p className="max-w-xs">
							Want to become a citizen scientist? Take our online course and learn how you can help survey our reefs.
						</p>
						<Link href="/lessons">
							<a className="btn secondary">Take the course</a>
						</Link>
					</div>
				</div>
			</section>
			<section className="min-h-[50vh] text-center">
				<div className="grid place-items-center gap-y-8">
					<h1 className="text-5xl sm:text-7xl">Get Involved!</h1>
					<div className="grid grid-cols-2 sm:grid-cols-4 gap-8 font-comic-cat text-xl leading-6">
						<GetInvolvedButton icon={<Laptop />} href="/register" text="Sign up" />
						<GetInvolvedButton icon={<Mask />} href="/teams" text="Join a team" />
						<GetInvolvedButton icon={<Coral />} href="/lessons" text="Take the course" />
						<GetInvolvedButton icon={<Camera />} href="/surveys/create" text="Conduct a survey" />
					</div>
				</div>
			</section>
			<section className={styles.secondary}>
				<div className="!max-w-2xl grid md:grid-cols-[200px_1fr] gap-x-6">
					<div className="hidden sm:flex items-center">
						<div className="h-3/4 relative aspect-[600/775] -left-28 lg:-left-40 -rotate-12">
							<Image src="/landing-3.png" alt="Diver" layout="fill" />
						</div>
					</div>
					<div>
						<h1 className="mb-4">Contact Us</h1>
						<form onSubmit={handleSubmit(onSubmit)}>
							<div className="control">
								<label htmlFor="name">Name</label>
								<input type="text" {...register('name')} />
								<p className="error">{errors.name?.message}</p>
							</div>
							<div className="control">
								<label htmlFor="email">Email</label>
								<input type="email"  {...register('email')} />
								<p className="error">{errors.email?.message}</p>
							</div>
							<div className="control">
								<label htmlFor="message">Message</label>
								<textarea id="message" rows={10} {...register('message')} />
								<p className="error">{errors.message?.message}</p>
							</div>
							<input type="submit" value="Submit" className="btn primary mt-8" />
						</form>
					</div>
				</div>
			</section>
		</div>
	)
}

export default Home
