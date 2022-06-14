import { NextPage } from 'next'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import Image from 'next/image'
import * as yup from 'yup'

interface ILoginInputs {
	email: string
	password: string
}

const loginSchema = yup.object({
	email: yup.string().email().trim().required(),
	password: yup.string().required(),
}).required()

const Login: NextPage = () => {
	const { register, handleSubmit, formState: { errors } } = useForm<ILoginInputs>({
		resolver: yupResolver(loginSchema)
	})
	const onSubmit = handleSubmit(data => console.log(data))

	return (
		<div className="grid place-items-center px-4 sm:px-0 py-10 sm:pt-0">
			<div className="bg-primary sm:w-[600px] w-full sm:px-12 p-8 rounded-lg">
				<div className="flex">
					<h2 className="font-comic-cat text-secondary mb-6 mr-4">LOG IN</h2>
					<Image src="/butterfly-fish-light.png" alt="Fish Icon" layout="fixed" width={40} height={40} />
				</div>
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
				<p className="mt-6 text-secondary">Don&apos;t have an account? <Link href="/register"><a>Sign up here {'>'}</a></Link></p>
				<p><Link href="/forgot"><a>Forgot your password?</a></Link></p>
			</div>
		</div>
	)
}

export default Login