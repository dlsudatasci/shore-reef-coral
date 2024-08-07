import { NextPage } from 'next'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import userSchema from '../models/user'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import app from '../lib/axios-config'
import { toast } from 'react-toastify'
import { toastErrorConfig } from '../lib/toast-defaults'
import Head from 'next/head'
import { InferType } from 'yup'
import Alert from '../components/alert'
import { useState } from 'react'
import { Clam } from '@components/icons'

const registerSchema = userSchema.pick(['email', 'password', 'firstName', 'lastName', 'affiliation'])
type RegisterSchema = InferType<typeof registerSchema>

const Register: NextPage = () => {
	const { status } = useSession()
	const router = useRouter()
	const [isTaken, setIsTaken] = useState(false)

	if (status == 'authenticated') {
		router.replace('/dashboard')
	}

	const { register, setError, handleSubmit, formState: { errors } } = useForm<RegisterSchema>({
		resolver: yupResolver(registerSchema)
	})
	const onSubmit = handleSubmit(async details => {
		const { status, data } = await app.post<Partial<RegisterSchema>>('/users', details)

		if (status === 200) {
			if (!Object.keys(data).length) { // no errors
				return router.push('/login?registered=true')
			}

			setIsTaken(data.email === 'Email is already taken!')

			let name: keyof typeof data
			let i = 0
			for (name in data) {
				setError(name, { type: 'custom', message: data[name] ?? undefined }, { shouldFocus: i++ == 0 })
			}
		} else {
			toast.error('A server-side error has occured. Please try again later.', toastErrorConfig)
		}
	})

	return (
		<div className="grid place-items-center px-4 sm:px-0 py-10">
			<Head>
				<title>Reef Mo | Register</title>
			</Head>
			<div className="bg-primary sm:w-[600px] w-full sm:px-12 p-8 rounded-lg">
				<div className="flex items-center mb-6 space-x-4">
					<h2 className="font-comic-cat text-secondary">REGISTER</h2>
					<Clam className="fill-secondary w-10" />
				</div>
				{isTaken &&
					<Alert isError message='An account is already registered with your email address. Please log in.' />
				}
				<form onSubmit={onSubmit}>
					<div className="control">
						<label htmlFor="email" className="text-secondary">email<span className="text-red-400"> *</span></label>
						<input type="email" id="email" {...register('email')} />
						<p className="error text-secondary">{errors.email?.message}</p>
					</div>
					<div className="control">
						<label htmlFor="password" className="text-secondary">password<span className="text-red-400"> *</span></label>
						<input type="password" id="password" {...register('password')} />
						<p className="error text-secondary">{errors.password?.message}</p>
					</div>
					<div className="control">
						<label htmlFor="first-name" className="text-secondary">first name<span className="text-red-400"> *</span></label>
						<input type="text" id="first-name" {...register('firstName')} />
						<p className="error text-secondary">{errors.firstName?.message}</p>
					</div>
					<div className="control">
						<label htmlFor="last-name" className="text-secondary">last name<span className="text-red-400"> *</span></label>
						<input type="text" id="last-name" {...register('lastName')} />
						<p className="error text-secondary">{errors.lastName?.message}</p>
					</div>
					<div className="control">
						<label htmlFor="affiliation" className="text-secondary">affiliation</label>
						<input type="text" id="affiliation" {...register('affiliation')} />
						<p className="error text-secondary">{errors.affiliation?.message}</p>
					</div>
					<input className="btn secondary mt-6" type="submit" value="Register" />
				</form>
				<p className="mt-6 text-secondary">Already have an account? <Link href="/login">Log in here {'>'}</Link></p>
			</div>
		</div>
	)
}

export default Register
