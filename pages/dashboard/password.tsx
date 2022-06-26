import { FC } from 'react';
import { useForm } from 'react-hook-form';
import ProfileLayout from '../../components/layouts/profile-layout'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'

interface IPasswordInputs {
	oldPassword: string
	newPassword: string
	confirmPassword: string
}

const passwordSchema = yup.object({
	oldPassword: yup.string().required('old password is required'),
	newPassword: yup.string().required('new password is required'),
	confirmPassword: yup.string().oneOf([yup.ref('newPassword'), null], 'passwords must match')
}).required()

const Profile: FC = () => {
	const { register, handleSubmit, formState: { errors } } = useForm<IPasswordInputs>({
		resolver: yupResolver(passwordSchema)
	})
	const onSubmit = handleSubmit(data => {

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
