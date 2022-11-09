import * as yup from 'yup'

export interface ITeam {
	leader: string
	scientist: string
	member1: string
	member2: string
	member3: string
	member4?: string
}

export const teamInfoSchema = yup.object({
	leader: yup.string().required('Team leader is required'),
	scientist: yup.string().required('Scientist is required.'),
	member1: yup.string().required('1st member is required.'),
	member2: yup.string().required('2nd member is required.'),
	member3: yup.string().required('3rd member is required.'),
	member4: yup.string().optional(),
}).required()
