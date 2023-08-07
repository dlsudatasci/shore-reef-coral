import { useForm } from 'react-hook-form'
import { ITeam, teamInfoSchema } from '@models/team'
import { yupResolver } from '@hookform/resolvers/yup'
import { Survey, useSurveyStore } from '@stores/survey-store'
import { shallow } from 'zustand/shallow'
import useSWR from 'swr'
import { fetcher } from '@lib/axios-config'
import LoadingSpinner from '@components/loading-spinner'
import { SurveyFormProps } from '.'
import { LeaderNamePayload } from '@pages/api/teams'

const storeSelector = (state: Survey) => [state.team, state.setTeam] as const

export function TeamInformation({ submitHandler, backHandler }: SurveyFormProps) {
	const [team, setTeam] = useSurveyStore(storeSelector, shallow)
	const { data: leaders, isLoading } = useSWR<LeaderNamePayload[]>('/teams?filter=leader', fetcher)
	const { register, handleSubmit, formState: { errors } } = useForm<ITeam>({
		resolver: yupResolver(teamInfoSchema),
		defaultValues: team,
	})
	const onSubmit = handleSubmit(
		data => {
			setTeam(data)
			if ((document.activeElement as HTMLInputElement)?.value == 'BACK') {
				return backHandler()
			}
			submitHandler()
		},
	)

	if (isLoading) {
		return <LoadingSpinner borderColor="border-highlight" />
	}

	return (
		<form id="survey-form" onSubmit={onSubmit}>
			<div className="control">
				<label htmlFor="leader" className="text-secondary">team leader</label>
				<select id="leader" {...register('leaderId')}>
					{leaders?.map(({ user }, i) => <option key={user.id} value={user.id} defaultChecked={!i}>{user.firstName} {user.lastName}</option>)}
				</select>
				<p className="error text-secondary">{errors.leaderId?.message}</p>
			</div>
			<div className="control">
				<label htmlFor="scientist" className="text-secondary">team scientist</label>
				<input type="text" id="scientist" {...register('scientist')} />
				<p className="error text-secondary">{errors.scientist?.message}</p>
			</div>
			<div className="control">
				<label htmlFor="member-1" className="text-secondary">volunteer member 1</label>
				<input type="text" id="member-1" {...register('volunteer1')} />
				<p className="error text-secondary">{errors.volunteer1?.message}</p>
			</div>
			<div className="control">
				<label htmlFor="member-2" className="text-secondary">volunteer member 2</label>
				<input type="text" id="member-2" {...register('volunteer2')} />
				<p className="error text-secondary">{errors.volunteer2?.message}</p>
			</div>
			<div className="control">
				<label htmlFor="member-3" className="text-secondary">volunteer member 3</label>
				<input type="text" id="member-3" {...register('volunteer3')} />
				<p className="error text-secondary">{errors.volunteer3?.message}</p>
			</div>
			<div className="control">
				<label htmlFor="member-4" className="text-secondary">volunteer member 4</label>
				<input type="text" id="member-4" {...register('volunteer4')} />
				<p className="error text-secondary">{errors.volunteer4?.message}</p>
			</div>
			<div className="control">
				<label htmlFor="member-5" className="text-secondary">volunteer member 5</label>
				<input type="text" id="member-5" {...register('volunteer5')} />
				<p className="error text-secondary">{errors.volunteer5?.message}</p>
			</div>
			<div className="control">
				<label htmlFor="member-6" className="text-secondary">volunteer member 6</label>
				<input type="text" id="member-6" {...register('volunteer6')} />
				<p className="error text-secondary">{errors.volunteer6?.message}</p>
			</div>
		</form>
	)
}
