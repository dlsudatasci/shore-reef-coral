import { object, string, date, InferType, number } from 'yup'

export interface ISurveyInformation extends InferType<typeof surveyInfoSchema> { }

export const surveyInfoSchema = object({
	date: date().typeError('Invalid date').required(),
	stationName: string().required(' Station name is required.'),
	startCorner: string().required('Start coordinate is required!').matches(/\d+.\d{3,4}, \d+.\d{3,4}/, { message: 'Invalid format! Should be: x.xxxx, x.xxxx' }),
	endCorner: string().required('End coordinate is required!').matches(/\d+.\d{3,4}, \d+.\d{3,4}/, { message: 'Invalid format! Should be: x.xxxx, x.xxxx' }),
	gpsDatum: string().required('GPS datum is required.'),
	province: string().required('Province is required.'),
	town: string().required('Town is required.'),
	barangay: string().required('Barangay is required.'),
	managementTypeId: number().required('Management is required.'),
	additionalInfo: string().optional(),
}).required()
