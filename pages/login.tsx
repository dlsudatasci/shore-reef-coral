import { NextPage } from 'next'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'

interface ILoginInputs {
	email: string
	password: string
}

const loginSchema = yup.object({
	email: yup.string().email().required(),
	password: yup.string().required(),
}).required()

const Login: NextPage = () => {
	const { register, handleSubmit, formState: { errors } } = useForm<ILoginInputs>({
		resolver: yupResolver(loginSchema)
	})
	const onSubmit = handleSubmit(data => console.log(data))

	return (
		<div className="grid place-items-center h-full px-4 sm:px-0">
			<div className="bg-primary sm:w-[600px] w-full sm:px-12 px-8 py-8 rounded-lg">
				<h2 className="font-comic-cat text-secondary mb-6">LOG IN</h2>
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
					<input className="btn secondary mt-6" type="submit" value="Login" />
				</form>
				<p className="mt-6 text-secondary">Don&apos;t have an account? <Link href="/register"><a>Sign up here {'>'}</a></Link></p>
				<p><Link href="/forgot"><a>Forgot your password?</a></Link></p>
			</div>
		</div>
	)
}

export default Login