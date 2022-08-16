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
							<h1>Heading</h1>
							<Image src="/mask-light.png" alt="Mask icon" width={50} height={50} />
						</div>
						<p>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Eligendi iste sunt sit quod corporis magnam voluptates veniam aperiam, facilis aspernatur quo quidem laudantium. Ea possimus sit officia perferendis vel mollitia!</p>
						<Link href="/surveys/submit">
							<a className="btn secondary w-72">Submit a survey</a>
						</Link>
					</div>
					<div className="relative">
						<Image src="/landing-1.jpg" layout="responsive" width="1920" height="1283" alt="A research team" objectFit="contain" />
					</div>
				</div>
			</section>
			<section>
				<div className="!max-w-prose mx-auto">
					<div className={styles.header}>
						<h1>Heading</h1>
						<Image src="/mask-dark.png" alt="Mask icon" width={50} height={50} />
					</div>
					<p>
						Lorem, ipsum dolor sit amet consectetur adipisicing elit. Consequatur molestiae nihil
						error deleniti veritatis tempora, ipsum aliquid placeat reprehenderit, voluptate aut quidem,
						officiis laboriosam. Dicta cum ratione distinctio numquam modi!
					</p>
					<Link href="/lessons">
						<a className="btn primary">Take the course</a>
					</Link>
				</div>
			</section>
			<section>
				<div className="grid md:grid-cols-2 gap-x-8 gap-y-12">
					<Image src="/landing-2.jpg" alt="Diver" layout="responsive" width={1132} height={723} />
					<div className="place-self-center">
						<p>
							Lorem ipsum, dolor sit amet consectetur adipisicing elit. Voluptatem odit reprehenderit
							minus ex sit ab eaque cupiditate facilis. Dolorum exercitationem fuga ipsa esse quas quia
							voluptates! Sunt accusantium amet alias?
						</p>
						<Link href="/about">
							<a className="btn secondary w-52">About</a>
						</Link>
					</div>
				</div>
				<div className="flex justify-between !max-w-2xl mx-auto mt-12">
					<div className={styles.logo} />
					<div className={styles.logo} />
					<div className={styles.logo} />
					<div className={styles.logo} />
				</div>
			</section>
			<section>
				<div className="!max-w-2xl grid md:grid-cols-[180px_1fr] gap-x-6">
					<div className="hidden md:grid h-min">
						<div className="self-start">
							<Image src="/mask-dark.png" alt="Mask Icon" width={140} height={140} />
						</div>
						<div className="justify-self-end">
							<Image src="/camera-dark.png" alt="Camera Icon" width={140} height={140} />
						</div>
						<div className="justify-self-start">
							<Image src="/fins-dark.png" alt="Flipper Icon" width={140} height={140} />
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
							<input type="submit" value="Submit" className="btn primary" />
						</form>
					</div>
				</div>
			</section>
		</div>
	)
}

export default Home
