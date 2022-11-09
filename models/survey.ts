import { object, number, string, date } from 'yup'

export interface ISurveyInformation {
	datetime: Date
	station: string
	startCorner: number
	endCorner?: number
	gps: string
	province: string
	town: string
	barangay: string
	management: string
	others?: string
}

export const surveyInfoSchema = object({
	datetime: date().typeError('Invalid date').required(),
	station: string().required(' Station name is required.'),
	startCorner: number().typeError('Start corner is required.').required(),
	endCorner: number().optional(),
	gps: string().required('GPS datum is required.'),
	province: string().required('Province is required.'),
	town: string().required('Town is required.'),
	barangay: string().required('Barangay is required.'),
	management: string().required('Management is required.'),
	others: string().optional(),
}).required()
