import { object, string, number } from 'yup'

const userSchema = object({
	id: number().positive().required(),
	email: string().trim().email().required('email is required'),
	password: string().required('password is required'),
	salt: string().required(),
	firstName: string().trim().required('first name is required'),
	lastName: string().trim().required('last name is required'),
	affiliation: string().trim().required('affiliation is required'),
	contactNumber: string().trim(),
}).required()

export default userSchema
