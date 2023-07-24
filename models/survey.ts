import { object, string, date, InferType, mixed } from 'yup'

export const MANAGEMENT_TYPES = ['None', 'Locally managed MPA', 'Nationally managed MPA'] as const

export interface ISurveyInformation extends InferType<typeof surveyInfoSchema> {
	management: typeof MANAGEMENT_TYPES[number]
}

export const surveyInfoSchema = object({
	datetime: date().typeError('Invalid date').required(),
	station: string().required(' Station name is required.'),
	startCorner: string().required('Start coordinate is required!').matches(/\d+.\d{3,4}, \d+.\d{3,4}/, { message: 'Invalid format! Should be: x.xxxx, x.xxxx' }),
	endCorner: string().required('End coordinate is required!').matches(/\d+.\d{3,4}, \d+.\d{3,4}/, { message: 'Invalid format! Should be: x.xxxx, x.xxxx' }),
	gps: string().required('GPS datum is required.'),
	province: string().required('Province is required.'),
	town: string().required('Town is required.'),
	barangay: string().required('Barangay is required.'),
	management: mixed<typeof MANAGEMENT_TYPES[number]>().oneOf([...MANAGEMENT_TYPES], 'Invalid option!').required('Management is required.'),
	others: string().optional(),
}).required()
