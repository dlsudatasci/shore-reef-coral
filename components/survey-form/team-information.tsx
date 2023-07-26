import { FC } from 'react'
import { useForm } from 'react-hook-form'
import { ITeam, teamInfoSchema } from '@models/team'
import { yupResolver } from '@hookform/resolvers/yup'
import useSurveyStore, { Survey } from '@stores/survey-store'
import { shallow } from 'zustand/shallow'
import useSWR from 'swr'
import { fetcher } from '@lib/axios-config'
import LoadingSpinner from '@components/loading-spinner'

const storeSelector = (state: Survey) => [state.team, state.setTeam] as const

const TeamInformation: FC<{ submitHandler: () => void, backHandler: () => void }> = ({ submitHandler, backHandler }) => {
	const [team, setTeam] = useSurveyStore(storeSelector, shallow)
	const { data: leaders, isLoading } = useSWR<string[]>('/teams?filter=leader', fetcher)
	const { register, handleSubmit, formState: { errors }, getValues } = useForm<ITeam>({
		resolver: yupResolver(teamInfoSchema),
		defaultValues: team,
	})
	const onSubmit = handleSubmit(
		data => { setTeam(data); submitHandler() },
		() => {
			if ((document.activeElement as HTMLInputElement)?.value == 'BACK') {
				setTeam(getValues())
				backHandler()
			}
		}
	)

	if (isLoading) {
		return <LoadingSpinner borderColor="border-highlight" />
	}

	return (
		<form id="survey-form" onSubmit={onSubmit}>
			<div className="control">
				<label htmlFor="leader" className="text-secondary">team leader</label>
				<select id="leader" {...register('leader')}>
					{leaders?.map((l, i) => <option key={i} value={l} defaultChecked={i === 0}>{l}</option>)}
				</select>
				<p className="error text-secondary">{errors.leader?.message}</p>
			</div>
			<div className="control">
				<label htmlFor="scientist" className="text-secondary">team scientist</label>
				<input type="text" id="scientist" {...register('scientist')} />
				<p className="error text-secondary">{errors.scientist?.message}</p>
			</div>
			<div className="control">
				<label htmlFor="member-1" className="text-secondary">volunteer member 1</label>
				<input type="text" id="member-1" {...register('member1')} />
				<p className="error text-secondary">{errors.member1?.message}</p>
			</div>
			<div className="control">
				<label htmlFor="member-2" className="text-secondary">volunteer member 2</label>
				<input type="text" id="member-2" {...register('member2')} />
				<p className="error text-secondary">{errors.member2?.message}</p>
			</div>
			<div className="control">
				<label htmlFor="member-3" className="text-secondary">volunteer member 3</label>
				<input type="text" id="member-3" {...register('member3')} />
				<p className="error text-secondary">{errors.member3?.message}</p>
			</div>
			<div className="control">
				<label htmlFor="member-4" className="text-secondary">volunteer member 4</label>
				<input type="text" id="member-4" {...register('member4')} />
				<p className="error text-secondary">{errors.member4?.message}</p>
			</div>
		</form>
	)
}

export default TeamInformation
