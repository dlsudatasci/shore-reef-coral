import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import ProfileLayout from '@components/layouts/profile-layout'
import { yupResolver } from '@hookform/resolvers/yup'
import useSWRImmutable from 'swr/immutable'
import app from '@lib/axios-config'
import { useSession } from "next-auth/react"
import { toast } from 'react-toastify'
import { useRouter } from 'next/router'
import Head from 'next/head'
import { InferType } from 'yup'
import userSchema from '@models/user'
import { toastSuccessConfig } from '@lib/toast-defaults'
import { NextPage } from 'next'

const profileSchema = userSchema.pick(['firstName', 'lastName', 'affiliation', 'contactNumber'])
type ProfileSchema = InferType<typeof profileSchema>

const fetcher = (url: string) => app.get<ProfileSchema>(url)
const useProfile = (id?: number) => {
	const { data, error, mutate } = useSWRImmutable(id ? `/api/users/${id}` : null, fetcher)
	
	return {
		data,
		isLoading: !data && !error,
		isError: !!error,
		mutate,
	}
}

const Profile: NextPage = () => {
	const router = useRouter()
	const session = useSession({
		required: true,
		onUnauthenticated() {
			router.replace('/login?from=/dashboard/profile&error=Please login to continue.')
		},
	})
	
	const { data, mutate } = useProfile(session.data?.user.id)
	const { register, handleSubmit, reset, formState: { errors } } = useForm<ProfileSchema>({
		resolver: yupResolver(profileSchema),
	})
	const onSubmit = handleSubmit(async details => {
		if (data) {
			data.data = details // update cache
		}

		await mutate(app.patch<ProfileSchema>(`/api/users/${session.data?.user.id}`, details), {
			optimisticData: data,
			revalidate: false,
			rollbackOnError: true,
		})
		toast.success('Details have been updated', toastSuccessConfig)
	})

	useEffect(() => {
		if (data?.data) {
			reset(data.data)
		}
	}, [reset, data?.data])
	
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
