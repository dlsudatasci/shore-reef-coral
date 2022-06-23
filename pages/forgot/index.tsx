import { yupResolver } from '@hookform/resolvers/yup'
import { NextPage } from 'next'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { useForm } from 'react-hook-form'
import * as yup from 'yup'
import { toast } from 'react-toastify'
import { toastSuccessConfig } from '../../lib/toast-defaults'
import { useState } from 'react'
import Link from 'next/link'

interface IForgot {
	email: string
}

const forgotSchema = yup.object({
	email: yup.string().email().trim().required(),
}).required()

const Forgot: NextPage = () => {
	const { register, handleSubmit, formState: { errors } } = useForm<IForgot>({
		resolver: yupResolver(forgotSchema)
	})
	const router = useRouter()
	const [email, setEmail] = useState('')
	const onSubmit = handleSubmit(data => {
		setEmail(data.email)
	})

	return (
		<div className="grid place-items-center px-4 sm:px-0 py-10 sm:pt-0">
			<div className="bg-primary sm:w-[600px] w-full sm:px-12 p-8 rounded-lg">
				<div className="flex mb-6">
					<h2 className="font-comic-cat text-secondary mr-4">FORGOT PASSWORD</h2>
					<Image src="/butterfly-fish-light.png" alt="Fish Icon" layout="fixed" width={40} height={40} />
				</div>
				{email == '' ?
					<>
						<p className="text-secondary mb-6">Enter your email address below and we&apos;ll send you a link to reset your password.</p>
						<form onSubmit={onSubmit}>
							<div className="control">
								<label htmlFor="email" className="text-secondary">email</label>
								<input type="email" id="email" {...register('email')} />
								<p className="error text-secondary">{errors.email?.message}</p>
							</div>
							<input className="btn secondary mt-4" type="submit" value="Send Rest Password Email" />
						</form>
					</>
					:
					<>
						<p className="text-secondary mb-4"> An email is on its way to <span className="font-bold">{email}</span> with instructions for resetting your password.</p>
						<p className="text-secondary mb-6">If you do not receive the email soon, check that the email address you entered is correct and check your spam folder.</p>
						<Link href="/login">
							<button className="btn secondary mt-4" type="button">Return to Sign In</button>
						</Link>
					</>
				}
			</div>
		</div>
	)
}

export default Forgot
