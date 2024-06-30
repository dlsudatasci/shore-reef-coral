import { yupResolver } from '@hookform/resolvers/yup'
import { NextPage } from 'next'
import { useForm } from 'react-hook-form'
import { useState } from 'react'
import Link from 'next/link'
import app from '@lib/axios-config'
import Alert from '@components/alert'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import userSchema from '@models/user'
import { InferType } from 'yup'
import { ButterflyFish } from '@components/icons'

const forgotSchema = userSchema.pick(['email'])

const Forgot: NextPage = () => {
	const { register, handleSubmit, formState: { errors } } = useForm<InferType<typeof forgotSchema>>({
		resolver: yupResolver(forgotSchema)
	})
	const session = useSession()
	const router = useRouter()
	const [email, setEmail] = useState('')
	const [notif, setNotif] = useState('')
	const [isSending, setIsSending] = useState(false)

	if (session.status == 'authenticated') {
		router.replace('/dashboard')
	}

	const onSubmit = handleSubmit(async details => {
		setIsSending(true)
		const { data, status } = await app.post('/forgot', details)
		setIsSending(false)

		if (status !== 200) {
			setNotif('A server-side error has occured. Please try again later!')
		} else if (data) {
			setEmail(details.email)
		} else {
			setNotif('Oops! The email you entered does not have a registered account. Please register.')
		}
	})
	// TODO: Fix
	return (
		<div className="grid place-items-center px-4 sm:px-0 py-10 sm:pt-0">
			<div className="bg-primary sm:w-[600px] w-full sm:px-12 p-8 rounded-lg">
				<div className="flex mb-6">
					<h2 className="font-comic-cat text-secondary mr-4">FORGOT PASSWORD</h2>
					<ButterflyFish className="fill-secondary w-10" />
				</div>
				{email == '' ?
					<>
						<p className="text-secondary mb-6">Enter your email address below and we&apos;ll send you a link to reset your password.</p>
						{notif && <Alert isError message={notif} />}
						<form onSubmit={onSubmit}>
							<div className="control">
								<label htmlFor="email" className="text-secondary">email</label>
								<input type="email" id="email" {...register('email')} />
								<p className="error text-secondary">{errors.email?.message}</p>
							</div>
							<input className="btn secondary mt-4" type="submit"
								value={isSending ? 'Sending...' : 'Send Reset Password Email'} disabled={isSending} />
						</form>
					</>
					:
					<>
						<p className="text-secondary mb-4"> An email is on its way to <span className="font-bold">{email}</span> with instructions for resetting your password.</p>
						<p className="text-secondary mb-6">If you do not receive the email soon, check that the email address you entered is correct and check your spam folder.</p>
						<Link href="/login" className="btn secondary mt-4">Return to Sign In</Link>
					</>
				}
			</div>
		</div>
	)
}

export default Forgot
