import { yupResolver } from '@hookform/resolvers/yup'
import { NextPage } from 'next'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { useForm } from 'react-hook-form'
import * as yup from 'yup'
import { toast } from 'react-toastify'
import { toastErrorConfig, toastSuccessConfig } from '../../../lib/toast-defaults'
import { useEffect } from 'react'
import app from '../../../lib/axios-config'
import { useSession } from 'next-auth/react'

interface IReset {
	password: string
	confirmPassword: string
}

const resetSchema = yup.object({
	password: yup.string().required('Password is a required field'),
	confirmPassword: yup.string()
}).required()

const Reset: NextPage = () => {
	const { register, handleSubmit, formState: { errors }, setError } = useForm<IReset>({
		resolver: yupResolver(resetSchema)
	})
	const router = useRouter()
	const session = useSession()

	if (session.status == 'authenticated') {
		router.replace('/dashboard')
	}

	// checks if link provided is valid, otherwise redirect to forgot password form
	useEffect(() => {
		if (router.query.userId) {
			app.get<boolean>(`/api/forgot/${router.query.userId}/${router.query.code}`)
				.then(({ data: isValid }) => {
					if (!isValid) {
						toast.error('The reset password link is invalid.')
						router.replace('/forgot')
					}
				})
		}
	}, [router])

	const onSubmit = handleSubmit(async data => {
		try {
			const { data: errors } = await app.patch<IReset>(`/api/forgot/${router.query.userId}/${router.query.code}`, data)

			if (!Object.keys(errors).length) {
				toast.success('Password reset successful!', toastSuccessConfig)
				router.replace('/login')
			}

			let k: keyof IReset, i = 0
			for (k in errors) {
				setError(k, { type: 'custom', message: errors[k] }, { shouldFocus: i++ == 0 })
			}
		} catch (err: any) {
			toast.error(err.response.data, toastErrorConfig)
			router.replace('/forgot')
		}
	})

	return (
		<div className="grid place-items-center px-4 sm:px-0 py-10 sm:pt-0">
			<div className="bg-primary sm:w-[600px] w-full sm:px-12 p-8 rounded-lg">
				<div className="flex mb-4">
					<h2 className="font-comic-cat text-secondary mr-4">RESET PASSWORD</h2>
					<Image src="/butterfly-fish-light.png" alt="Fish Icon" layout="fixed" width={40} height={40} />
				</div>
				<p className="text-secondary">You have requested to reset your password.</p>
				<p className="text-secondary mb-6">Your password should be at least 8 characters and should contain alphanumeric characters.</p>
				<form onSubmit={onSubmit}>
					<div className="control">
						<label htmlFor="password" className="text-secondary">new password</label>
						<input type="password" id="password" {...register('password')} />
						<p className="error text-secondary">{errors.password?.message}</p>
					</div>
					<div className="control">
						<label htmlFor="confirm" className="text-secondary">confirm password</label>
						<input type="password" id="confirm" {...register('confirmPassword')} />
						<p className="error text-secondary">{errors.confirmPassword?.message}</p>
					</div>
					<input className="btn secondary mt-4" type="submit" value="Reset Password" />
				</form>
			</div>
		</div>
	)
}

export default Reset
