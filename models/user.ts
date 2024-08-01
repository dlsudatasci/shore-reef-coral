import { object, string, number } from 'yup'

const userSchema = object({
	id: number().positive().required(),
	email: string().trim().email().required('email is required'),
	password: string().required('password is required'),
	salt: string().required(),
	firstName: string().trim().required('first name is required'),
	lastName: string().trim().required('last name is required'),
	affiliation: string().nullable().trim(),
	contactNumber: string().nullable().trim()
	.matches(/^[\d()+-]*$/, "Contact number should contain only numbers, +, -, (, and )")
	.length(13, "Contact number should be exactly 10 digits long."),
}).required()

export default userSchema
