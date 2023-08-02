import { useEffect } from 'react'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm } from 'react-hook-form'
import { surveyInfoSchema, ISurveyInformation, MANAGEMENT_TYPES } from '@models/survey'
import { Survey, useSurveyStore } from '@stores/survey-store'
import { shallow } from 'zustand/shallow'
import useSWRImmutable from 'swr/immutable'
import axios from 'axios'
import LoadingSpinner from '@components/loading-spinner'
import { SurveyFormProps } from '.'

const storeSelector = (state: Survey) => [state.surveyInfo, state.setSurveyInfo] as const

export function SurveyInformation({ submitHandler }: SurveyFormProps) {
	const [surveyInfo, setSurveyInfo] = useSurveyStore(storeSelector, shallow)
	const { data: locations, isLoading } = useSWRImmutable('/bgy-masterlist.json', url => axios.get(url).then(res => res.data))

	const { register, handleSubmit, formState: { errors }, watch, setValue, getValues } = useForm<ISurveyInformation>({
		resolver: yupResolver(surveyInfoSchema),
		// @ts-ignore
		defaultValues: { ...surveyInfo, datetime: surveyInfo.datetime.toLocaleString('sv').slice(0, -3).replace(' ', 'T') },
	})

	const province = watch('province')
	const town = watch('town')

	useEffect(() => {
		if (!locations) return

		if (!locations[2][province + getValues('town')]) {
			setValue('town', '')
			setValue('barangay', '')
		}
	}, [province, locations])

	useEffect(() => {
		if (!locations) return

		const brgy = getValues('barangay')
		if (!locations[2][province + town]?.find((b: string) => b === brgy)) {
			setValue('barangay', '')
		}
	}, [town, locations])

	const onSubmit = handleSubmit(data => {
		setSurveyInfo(data)
		submitHandler()
	})

	if (isLoading) {
		return <LoadingSpinner borderColor="border-highlight" />
	}

	return (
		<form id="survey-form" onSubmit={onSubmit}>
			<div className="control">
				<label htmlFor="datetime" className="text-secondary">survey date and time</label>
				<input type="datetime-local" id="datetime" {...register('datetime')} />
				<p className="error text-secondary">{errors.datetime?.message}</p>
			</div>
			<div className="control">
				<label htmlFor="station" className="text-secondary">station name</label>
				<input type="text" id="station" {...register('station')} />
				<p className="error text-secondary">{errors.station?.message}</p>
			</div>
			<div className="control">
				<label htmlFor="start-coordinates" className="text-secondary">starting corner coordinates</label>
				<input type="text" id="start-coordinates" placeholder="12.3456, 7.8901" {...register('startCorner')} />
				<p className="error text-secondary">{errors.startCorner?.message}</p>
			</div>
			<div className="control">
				<label htmlFor="end-coordinates" className="text-secondary">ending corner coordinates</label>
				<input type="text" id="end-coordinates" placeholder="12.3456, 7.8901" {...register('endCorner')} />
				<p className="error text-secondary">{errors.endCorner?.message}</p>
			</div>
			<div className="control">
				<label htmlFor="gps" className="text-secondary">gps datum</label>
				<input type="text" id="gps" {...register('gps')} placeholder="WGS84" />
				<p className="error text-secondary">{errors.gps?.message}</p>
			</div>
			<div className="control">
				<label htmlFor="province" className="text-secondary">province</label>
				<select id="province" {...register('province')}>
					<option value="" disabled defaultChecked>-SELECT PROVINCE-</option>
					{locations[0].map((l: string) => (
						<option key={l} value={l}>{l}</option>
					))}
				</select>
				<p className="error text-secondary">{errors.province?.message}</p>
			</div>
			<div className="control">
				<label htmlFor="town" className="text-secondary">town</label>
				<select id="town" {...register('town')} disabled={!locations[1][province]}>
					<option value="" disabled defaultChecked>-SELECT TOWN-</option>
					{
						locations[1][province]?.map((t: string) => (
							<option key={t} value={t}>{t}</option>
						))
					}
				</select>
				<p className="error text-secondary">{errors.town?.message}</p>
			</div>
			<div className="control">
				<label htmlFor="barangay" className="text-secondary">barangay</label>
				<select id="barangay" {...register('barangay')} disabled={!locations[2][province + town]}>
					<option value="" disabled defaultChecked>-SELECT BARANGAY-</option>
					{
						locations[2][province + town]?.map((b: string) => (
							<option key={b} value={b}>{b}</option>
						))
					}
				</select>
				<p className="error text-secondary">{errors.barangay?.message}</p>
			</div>
			<div className="control">
				<label htmlFor="management" className="text-secondary">type of management</label>
				<select id="management" {...register('management')}>
					{MANAGEMENT_TYPES.map(d => <option key={d} value={d}>{d}</option>)}
				</select>
				<p className="error text-secondary">{errors.management?.message}</p>
			</div>
			<div className="control">
				<label htmlFor="others" className="text-secondary">additional information</label>
				<textarea id="others" {...register('others')} rows={3} />
				<p className="error text-secondary">{errors.others?.message}</p>
			</div>
		</form>
	)
}
