/* eslint-disable react-hooks/exhaustive-deps */
import DashboardLayout from '@components/layouts/dashboard-layout'
import { yupResolver } from '@hookform/resolvers/yup'
import app from '@lib/axios-config'
import Axios from 'axios'
import { NextPage } from 'next'
import { useRouter } from 'next/router'
import { useForm } from 'react-hook-form'
import { string, object, InferType } from 'yup'
import useSWRImmutable from 'swr/immutable'
import axios from 'axios'
import LoadingSpinner from '@components/loading-spinner'
import { useEffect } from 'react'
import { useUserOnlyAccess } from '@lib/useRoleAccess'

const teamCreateSchema = object({
	name: string().trim().required('Team name is required.'),
	barangay: string().trim().required('Barangay is required.'),
	town: string().trim().required('Town is required.'),
	province: string().trim().required('Province is required.'),
	affiliation: string().trim().optional(),
})

export type TeamCreateSchema = InferType<typeof teamCreateSchema>

const CreateTeam: NextPage = () => {
	const { data: locations, isLoading } = useSWRImmutable('/bgy-masterlist.json', url => axios.get(url).then(res => res.data))
	const { handleSubmit, formState: { errors }, register, setError, watch, setValue } = useForm<TeamCreateSchema>({
		resolver: yupResolver(teamCreateSchema)
	})
	const { push } = useRouter()

	const province = watch('province')
	const town = watch('town')
	useUserOnlyAccess()

	useEffect(() => {
		setValue('town', '')
	}, [province])

	useEffect(() => {
		setValue('barangay', '')
	}, [town])

	async function onSubmit(data: TeamCreateSchema) {
		try {
			await app.post('/teams', data)
			push('/dashboard')
		} catch (err) {
			if (Axios.isAxiosError(err)) {
				const messages = err.response?.data as Partial<TeamCreateSchema>

				for (const [key, value] of Object.entries(messages)) {
					setError(key as keyof TeamCreateSchema, { type: 'custom', message: value })
				}
			}
		}
	}

	if (isLoading) {
		return <LoadingSpinner borderColor="border-highlight" />
	}

	return (
		<DashboardLayout>
			<h2 className="font-comic-cat text-secondary mt-24 text-center mb-8">Create a team</h2>
			<form className="max-w-2xl mx-auto space-y-1 mb-16" onSubmit={handleSubmit(onSubmit)}>
				<div className="control">
					<label htmlFor="name" className="text-secondary required">Team Name</label>
					<input type="text" id="name" {...register('name')} />
					<p className="error">{errors.name?.message}</p>
				</div>
				<div className="control">
					<label htmlFor="province" className="text-secondary required">Province</label>
					<select id="province" {...register('province')} defaultValue="">
						<option value="" disabled defaultChecked>-SELECT PROVINCE-</option>
						{locations[0].map((l: string) => (
							<option key={l} value={l}>{l}</option>
						))}
					</select>
					<p className="error">{errors.province?.message}</p>
				</div>
				<div className="control">
					<label htmlFor="town" className="text-secondary required">Town</label>
					<select id="town" {...register('town')} disabled={!locations[1][province]} defaultValue="">
						<option value="" disabled defaultChecked>-SELECT TOWN-</option>
						{
							locations[1][province]?.map((t: string) => (
								<option key={t} value={t}>{t}</option>
							))
						}
					</select>
					<p className="error">{errors.town?.message}</p>
				</div>
				<div className="control">
					<label htmlFor="barangay" className="text-secondary required">Barangay</label>
					<select id="barangay" {...register('barangay')} disabled={!locations[2][province + town]} defaultValue="">
						<option value="" disabled defaultChecked>-SELECT BARANGAY-</option>
						{
							locations[2][province + town]?.map((b: string) => (
								<option key={b} value={b}>{b}</option>
							))
						}
					</select>
					<p className="error">{errors.barangay?.message}</p>
				</div>
				<div className="control">
					<label htmlFor="affiliation" className="text-secondary">Affiliation</label>
					<input type="text" id="affiliation" {...register('affiliation')} />
					<p className="error">{errors.affiliation?.message}</p>
				</div>
				<div className="flex justify-center">
					<input type="submit" value="Create" className="btn highlight" />
				</div>
			</form>
		</DashboardLayout>
	)
}

export default CreateTeam
