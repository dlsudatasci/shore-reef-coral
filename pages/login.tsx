import { NextPage } from 'next'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import userSchema from '../models/user'
import { signIn, useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import Alert from '../components/alert'
import Head from 'next/head'
import { InferType } from 'yup'
import { useEffect, useState } from 'react'
import ButterflyFish from '@components/icons/butterfly-fish'

const loginSchema = userSchema.pick(['email', 'password'])

const Login: NextPage = () => {
	const { status } = useSession()
	const router = useRouter()
	const [message, setMessage] = useState('')

	useEffect(() => {
		if (router.query.error) {
			setMessage(router.query.error as string)
		}
	}, [router.query])

	if (status == 'authenticated') {
		router.replace(router.query.from as string ?? '/dashboard')
	}

	const { register, handleSubmit, formState: { errors } } = useForm<InferType<typeof loginSchema>>({
		resolver: yupResolver(loginSchema)
	})
	const onSubmit = handleSubmit(async (data) => {
		const res = await signIn('credentials', {
			redirect: false,
			...data
		})

		if (res?.status == 401 && res.error) {
			setMessage(res.error)
		} else if (!res?.ok) {
			setMessage('A server-side error has occured! Please try again later.')
		}
	})

	return (
		<div className="grid place-items-center px-4 sm:px-0 py-10 sm:pt-0">
			<Head>
				<title>Reef Mo | Login</title>
			</Head>
			<div className="bg-primary sm:w-[600px] w-full sm:px-12 p-8 rounded-lg">
				<div className="flex items-center mb-6 space-x-4">
					<h2 className="font-comic-cat text-secondary">LOG IN</h2>
					<ButterflyFish className="fill-secondary w-10" />
				</div>
				{router.query.registered && <Alert message="Congratulations! Your account has been created. Kindly login to continue." />}
				{message !== '' && <Alert isError message={message} />}
				<form onSubmit={onSubmit}>
					<div className="control">
						<label htmlFor="email" className="text-secondary">email</label>
						<input type="email" id="email" {...register('email')} />
						<p className="error text-secondary">{errors.email?.message}</p>
					</div>
					<div className="control">
						<label htmlFor="password" className="text-secondary">password</label>
						<input type="password" id="password" {...register('password')} />
						<p className="error text-secondary">{errors.password?.message}</p>
					</div>
					<input className="btn secondary mt-4" type="submit" value="Login" />
				</form>
				<p className="mt-6 text-secondary">Don&apos;t have an account? <Link href="/register">Sign up here {'>'}</Link></p>
				<p><Link href="/forgot">Forgot your password?</Link></p>
			</div>
		</div>
	)
}

export default Login
