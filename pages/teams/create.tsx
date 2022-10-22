import DashboardLayout from '@components/layouts/dashboard-layout'
import { yupResolver } from '@hookform/resolvers/yup'
import app from '@lib/axios-config'
import { NextPage } from 'next'
import { useRouter } from 'next/router'
import { useForm } from 'react-hook-form'
import * as yup from 'yup'

const teamCreateSchema = yup.object({
	name: yup.string().trim().required('Team name is required.'),
	barangay: yup.string().trim().required('Barangay is required.'),
	town: yup.string().trim().required('Town is required.'),
	province: yup.string().trim().required('Province is required.'),
	affiliation: yup.string().trim().optional(),
})

type TeamCreateSchema = yup.InferType<typeof teamCreateSchema>

const CreateTeam: NextPage = () => {
	const { handleSubmit, formState: { errors }, register } = useForm<TeamCreateSchema>({
		resolver: yupResolver(teamCreateSchema)
	})
	const { push } = useRouter()

	async function onSubmit(data: TeamCreateSchema) {
		try {
			await app.post('/teams', data)
			push('/dashboard')
		} catch (err) {
			
		}
	}

	return (
		<DashboardLayout>
			<h2 className="font-comic-cat text-secondary mt-24 text-center mb-8">Create a team</h2>
			<form className="max-w-2xl mx-auto space-y-1" onSubmit={handleSubmit(onSubmit)}>
				<div className="control">
					<label htmlFor="name" className="text-secondary required">Team Name</label>
					<input type="text" id="name" {...register('name')} />
					<p className="error">{errors.name?.message}</p>
				</div>
				<div className="control">
					<label htmlFor="province" className="text-secondary required">Province</label>
					<input type="text" id="province" {...register('province')} />
					<p className="error">{errors.province?.message}</p>
				</div>
				<div className="control">
					<label htmlFor="town" className="text-secondary required">Town</label>
					<input type="text" id="town" {...register('town')} />
					<p className="error">{errors.town?.message}</p>
				</div>
				<div className="control">
					<label htmlFor="barangay" className="text-secondary required">Barangay</label>
					<input type="text" id="barangay" {...register('barangay')} />
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
