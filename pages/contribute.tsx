import { NextPage } from 'next'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import SURVEY_STEPS from '../lib/survey-steps'
import Steps from '../components/steps'
import Image from 'next/image'

interface ISurveyInformation {
	datetime: Date
	station: string
	startCorner: string
	endCorner: string
	gps: string
	province: string
	town: string
	barangay: string
	management: string
	others: string
}

const surveyInfoSchema = yup.object({
	datetime: yup.date().typeError('Invalid date').required(),
	station: yup.string().required(),
	startCorner: yup.string().required(),
	endCorner: yup.string().required(),
	gps: yup.string().required(),
	province: yup.string().required(),
	town: yup.string().required(),
	barangay: yup.string().required(),
	management: yup.string().required(),
	others: yup.string(),
}).required()

const Contribute: NextPage = () => {
	const { register, handleSubmit, formState: { errors } } = useForm<ISurveyInformation>({
		resolver: yupResolver(surveyInfoSchema)
	})
	const onSubmit = handleSubmit(data => console.log(data))

	return (
		<>
			<div className="bg-cover pt-28 pb-14 grid justify-center" style={{ backgroundImage: 'url("/beach-bg.jpg")'}}>
				<div className="flex justify-center border-secondary border-2 items-center mb-20 py-6 px-4">
					<h1 className="font-comic-cat text-secondary text-center mr-4">SUBMIT A SURVEY</h1>
					<Image src="/mask-light.png" alt="Mask Icon" width={60} height={60} layout="fixed" />
				</div>
				<div className="mb-10 w-[600px]">
					<Steps steps={SURVEY_STEPS} />
				</div>
			</div>
			<div className="grid justify-stretch md:justify-center px-4 md:px-0 bg-primary">
				<div className="md:w-[700px] w-full md:px-12 px-8 rounded-lg">
					<h3 className="font-comic-cat text-secondary text-center text-3xl mb-4">SURVERY INFORMATION</h3>
					<form onSubmit={onSubmit}>
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
							<input type="text" id="start-coordinates" {...register('startCorner')} />
							<p className="error text-secondary">{errors.startCorner?.message}</p>
						</div>
						<div className="control">
							<label htmlFor="end-coordinates" className="text-secondary">starting corner coordinates</label>
							<input type="text" id="end-coordinates" {...register('endCorner')} />
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
						<input className="btn secondary" type="submit" value="NEXT" />
					</form>
				</div>
			</div>
		</>
	)
}

export default Contribute
