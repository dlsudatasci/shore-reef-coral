import { number, string, InferType, object } from 'yup'

export type ITeam = InferType<typeof teamInfoSchema>

export const teamInfoSchema = object({
	leader: number().required('Team leader is required'),
	scientist: string().required('Scientist is required.'),
	volunteer1: string().required('1st member is required.'),
	volunteer2: string().required('2nd member is required.'),
	volunteer3: string().required('3rd member is required.'),
	volunteer4: string().optional(),
}).required()
