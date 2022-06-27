import { FC, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import ProfileLayout from '../../components/layouts/profile-layout'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import useSWRImmutable from 'swr/immutable'
import app from '../../lib/axios-config'
import { useSession } from "next-auth/react"
import { toast } from 'react-toastify'
import { useRouter } from 'next/router'
import Head from 'next/head'

interface IProfileInputs {
	firstName: string
	lastName: string
	affiliation: string
	contactNumber: string
}

const profileSchema = yup.object({
	firstName: yup.string().trim().required('first name is required'),
	lastName: yup.string().trim().required('last name is required'),
	affiliation: yup.string().trim().required('affiliation is required'),
	contactNumber: yup.string().trim(),
}).required()

const useProfile = () => {
	const { data, error, mutate } = useSWRImmutable(`/api/users/me`, (url: string) => app.get<IProfileInputs>(url))
	return {
		profile: data?.data,
		isLoading: !data && !error,
		isError: !!error,
		mutate,
	}
}

const Profile: FC = () => {
	const router = useRouter()
	useSession({
		required: true,
		onUnauthenticated() {
			toast.error('Unauthorized. Please login to continue')
			router.replace('/login?from=/dashboard/profile')
		},
	})
	const { profile, isLoading, isError } = useProfile()
	const { register, handleSubmit, reset, formState: { errors } } = useForm<IProfileInputs>({
		resolver: yupResolver(profileSchema),
	})
	const onSubmit = handleSubmit(data => {
		
	})

	useEffect(() => {
		if (profile) {
			reset(profile)
		}
	}, [reset, profile])
	
	return (
		<ProfileLayout>
			<Head>
				<title>Reef Mo | Account</title>
			</Head>
			<div className="rounded-lg bg-secondary p-8">
				<h2 className="font-comic-cat text-primary mb-8">Profile</h2>
				<form id="profile-form" onSubmit={onSubmit} className="grid md:grid-cols-2 gap-x-8 gap-y-1.5">
					<div className="control">
						<label htmlFor="first-name" className="text-primary">first name</label>
						<input id="first-name" type="text" {...register('firstName')} />
						<p className="error text-error">{errors.firstName?.message}</p>
					</div>
					<div className="control">
						<label htmlFor="last-name" className="text-primary">last name</label>
						<input id="last-name" type="text" {...register('lastName')} />
						<p className="error text-error">{errors.lastName?.message}</p>
					</div>
					<div className="control">
						<label htmlFor="affiliation" className="text-primary">affiliation</label>
						<input id="affiliation" type="text" {...register('affiliation')} />
						<p className="error text-error">{errors.affiliation?.message}</p>
					</div>
					<div className="control">
						<label htmlFor="contact-number" className="text-primary">contact number</label>
						<input id="contact-number" type="tel" {...register('contactNumber')} />
						<p className="error text-error">{errors.contactNumber?.message}</p>
					</div>
				</form>
				<input type="submit" form="profile-form" className="btn primary mt-8" value="Save Changes" />
			</div>
		</ProfileLayout>
	)
}

export default Profile
