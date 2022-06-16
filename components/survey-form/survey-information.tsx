import { FC, useEffect } from 'react'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm } from 'react-hook-form'
import { surveyInfoSchema, ISurveyInformation } from '../../models/survey'
import useSurveyStore, { Survey } from '../../stores/survey-store'
import shallow from 'zustand/shallow'

const storeSelector = (state: Survey) => [state.surveyInfo, state.setSurveyInfo] as const

const SurveyInformation: FC<{ submitHandler: () => void }> = ({ submitHandler }) => {
	const [surveyInfo, setSurveyInfo] = useSurveyStore(storeSelector, shallow)

	const { register, handleSubmit, formState: { errors }} = useForm<ISurveyInformation>({
		resolver: yupResolver(surveyInfoSchema),
		// @ts-ignore 
		defaultValues: { ...surveyInfo, datetime: surveyInfo.datetime.toLocaleString('sv').slice(0, -3).replace(' ', 'T') },
	})

	const onSubmit = handleSubmit(data => {
		setSurveyInfo(data)
		submitHandler()
	})

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
				<input type="number" id="start-coordinates" {...register('startCorner')} />
				<p className="error text-secondary">{errors.startCorner?.message}</p>
			</div>
			<div className="control">
				<label htmlFor="end-coordinates" className="text-secondary">ending corner coordinates</label>
				<input type="number" id="end-coordinates" {...register('endCorner', {
					setValueAs: v => v === '' ? undefined : parseInt(v)
				})} />
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
					<option value="Manila">Manila</option>
				</select>
				<p className="error text-secondary">{errors.province?.message}</p>
			</div>
			<div className="control">
				<label htmlFor="town" className="text-secondary">town</label>
				<select id="town" {...register('town')}>
					<option value="Manila">Manila</option>
				</select>
				<p className="error text-secondary">{errors.town?.message}</p>
			</div>
			<div className="control">
				<label htmlFor="barangay" className="text-secondary">barangay</label>
				<select id="barangay" {...register('barangay')}>
					<option value="Manila">Manila</option>
				</select>
				<p className="error text-secondary">{errors.barangay?.message}</p>
			</div>
			<div className="control">
				<label htmlFor="management" className="text-secondary">type of management</label>
				<select id="management" {...register('management')}>
					<option value="Manila">Manila</option>
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

export default SurveyInformation
