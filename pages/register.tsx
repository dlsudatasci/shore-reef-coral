import { NextPage } from 'next'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import Image from 'next/image'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'

interface IRegisterInputs {
	email: string
	password: string
	firstName: string
	lastName: string
	affiliation: string
}

const registerSchema = yup.object({
	email: yup.string().trim().email().required(),
	password: yup.string().required(),
	firstName: yup.string().required().trim(),
	lastName: yup.string().required().trim(),
	affiliation: yup.string().required().trim(),
}).required()

const Register: NextPage = () => {
	const { status } = useSession()
	const router = useRouter()

	if (status == 'authenticated') {
		router.replace('/dashboard')
	}

	const { register, handleSubmit, formState: { errors } } = useForm<IRegisterInputs>({
		resolver: yupResolver(registerSchema)
	})
	const onSubmit = handleSubmit(data => console.log(data))

	return (
		<div className="grid place-items-center px-4 sm:px-0 py-10">
			<div className="bg-primary sm:w-[600px] w-full sm:px-12 p-8 rounded-lg">
				<div className="flex">
					<h2 className="font-comic-cat text-secondary mb-6 mr-4">REGISTER</h2>
					<Image src="/clam-light.png" alt="Fish Icon" layout="fixed" width={40} height={40} />
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
					<div className="control">
						<label htmlFor="first-name" className="text-secondary">first name</label>
						<input type="text" id="first-name" {...register('firstName')} />
						<p className="error text-secondary">{errors.firstName?.message}</p>
					</div>
					<div className="control">
						<label htmlFor="last-name" className="text-secondary">last name</label>
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
				<p className="mt-6 text-secondary">Already have an account? <Link href="/login"><a>Log in here {'>'}</a></Link></p>
			</div>
		</div>
	)
}

export default Register
