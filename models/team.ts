import * as yup from 'yup'

export interface ITeam {
	leader: string
	scientist: string
	member1?: string
	member2?: string
	member3?: string
	member4?: string
}

export const teamInfoSchema = yup.object({
	leader: yup.string().required(),
	scientist: yup.string().required(),
	member1: yup.string(),
	member2: yup.string(),
	member3: yup.string(),
	member4: yup.string(),
}).required()
