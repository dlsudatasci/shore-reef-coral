import { useForm } from 'react-hook-form'
import ProfileLayout from '../../components/layouts/profile-layout'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import app from '../../lib/axios-config'
import { toast } from 'react-toastify'
import { toastErrorConfig, toastSuccessConfig } from '../../lib/toast-defaults'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import { NextPage } from 'next'

export interface IPasswordInputs {
	oldPassword: string
	newPassword: string
	confirmPassword: string
}

const passwordSchema = yup.object({
	oldPassword: yup.string().required('old password is required'),
	newPassword: yup.string().required('new password is required')
		.notOneOf([yup.ref('oldPassword')], 'new password must be different from old password'),
	confirmPassword: yup.string().oneOf([yup.ref('newPassword'), null], 'passwords must match')
}).required()

const Profile: NextPage = () => {
	const router = useRouter()
	const session = useSession({
		required: true,
		onUnauthenticated() {
			router.replace('/login?from=/dashboard/profile&error=Please login to continue.')
		},
	})
	const { register, handleSubmit, setError, reset, formState: { errors } } = useForm<IPasswordInputs>({
		resolver: yupResolver(passwordSchema)
	})
	const onSubmit = handleSubmit(async details => {
		const { status, data } = await app.patch<Partial<IPasswordInputs>>(
			`/users/${session.data?.user.id}/password`, details
		)

		if (status != 200) {
			return toast.error('A server-side error has occured. Please try again later.', toastErrorConfig)
		}

		if (!Object.keys(data).length) {
			toast.success('Password change successful!', toastSuccessConfig)
			return reset()
		}

		let k: keyof IPasswordInputs, i = 0
		for (k in data) {
			setError(k, { type: 'custom', message: data[k] }, { shouldFocus: i++ == 0 })
		}
	})

	return (
		<ProfileLayout>
			<div className="rounded-lg bg-secondary p-8">
				<h2 className="font-comic-cat text-primary mb-8">Change Password</h2>
				<form id="profile-form" onSubmit={onSubmit} className="grid gap-y-1.5">
					<div className="control">
						<label htmlFor="old" className="text-primary">old password</label>
						<input id="old" type="password" {...register('oldPassword')} />
						<p className="error text-error">{errors.oldPassword?.message}</p>
					</div>
					<div className="control">
						<label htmlFor="new" className="text-primary">new password</label>
						<input id="new" type="password" {...register('newPassword')} />
						<p className="error text-error">{errors.newPassword?.message}</p>
					</div>
					<div className="control">
						<label htmlFor="confirm" className="text-primary">confirm password</label>
						<input id="confirm" type="password" {...register('confirmPassword')} />
						<p className="error text-error">{errors.confirmPassword?.message}</p>
					</div>
				</form>
				<input type="submit" form="profile-form" className="btn primary mt-8" value="Save New Password" />
			</div>
		</ProfileLayout>
	)
}

export default Profile
