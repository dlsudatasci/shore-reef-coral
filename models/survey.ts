import * as yup from 'yup'

export interface ISurveyInformation {
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

export const surveyInfoSchema = yup.object({
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

