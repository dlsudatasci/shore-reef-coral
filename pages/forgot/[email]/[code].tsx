import { yupResolver } from '@hookform/resolvers/yup'
import { NextPage } from 'next'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { useForm } from 'react-hook-form'
import * as yup from 'yup'
import { toast } from 'react-toastify'
import { toastSuccessConfig } from '../../../lib/toast-defaults'
import { useEffect } from 'react'

interface IReset {
	password: string
	newPassword: string
}

const resetSchema = yup.object({
	password: yup.string().required('Password is a required field'),
	newPassword: yup.string().oneOf([yup.ref('password'), null], 'Passwords must match')
}).required()

const Reset: NextPage = () => {
	const { register, handleSubmit, formState: { errors } } = useForm<IReset>({
		resolver: yupResolver(resetSchema)
	})
	const router = useRouter()

	useEffect(() => {
		const { email, code } = router.query
		
		if (email != '') {
			console.log(email, code)
		}
	}, [router.query])

	const onSubmit = handleSubmit(data => {
		toast.success('Password reset successful!', toastSuccessConfig)
		router.replace('/')
	})

	return (
		<div className="grid place-items-center px-4 sm:px-0 py-10 sm:pt-0">
			<div className="bg-primary sm:w-[600px] w-full sm:px-12 p-8 rounded-lg">
				<div className="flex mb-2">
					<h2 className="font-comic-cat text-secondary mr-4">RESET PASSWORD</h2>
					<Image src="/butterfly-fish-light.png" alt="Fish Icon" layout="fixed" width={40} height={40} />
				</div>
				<p className="text-white mb-6">You have requested to reset your password.
					Your password should be at least 8 characters and should contain alphanumeric characters.</p>
				<form onSubmit={onSubmit}>
					<div className="control">
						<label htmlFor="password" className="text-secondary">new password</label>
						<input type="password" id="password" {...register('password')} />
						<p className="error text-secondary">{errors.password?.message}</p>
					</div>
					<div className="control">
						<label htmlFor="confirm" className="text-secondary">confirm password</label>
						<input type="password" id="confirm" {...register('newPassword')} />
						<p className="error text-secondary">{errors.newPassword?.message}</p>
					</div>
					<input className="btn secondary mt-4" type="submit" value="Reset Password" />
				</form>
			</div>
		</div>
	)
}

export default Reset
