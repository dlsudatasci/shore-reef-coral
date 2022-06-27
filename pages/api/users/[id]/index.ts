import { PrismaClient } from '@prisma/client'
import { NextApiRequest, NextApiResponse } from 'next'
import userSchema from '../../../../models/user'
import { InferType } from 'yup'

const prisma = new PrismaClient()

const ChangeHandler = async (req: NextApiRequest, res: NextApiResponse) => {
	const { body, method, query } = req
	const id = parseInt(query.id as string)

	try {
		switch (method) {
			case 'GET': {
				const user = await prisma.user.findFirst({
					select: { firstName: true, lastName: true, affiliation: true, contactNumber: true },
					where: { id }
				})
				res.json(user)
				break
			}

			case 'PATCH': {
				const patchSchema = userSchema.pick(['firstName', 'lastName', 'affiliation', 'contactNumber'])
				const data = await patchSchema.validate(body, { stripUnknown: true })
				const user = await prisma.user.update({
					select: { firstName: true, lastName: true, affiliation: true, contactNumber: true },
					data, 
					where: { id } 
				})
				res.json(user)
				break
			}

			default:
				res.setHeader('Allow', ['GET'])
				res.status(405).end(`Method ${method} Not Allowed`)
		}
	} catch (err) {
		console.error(err)
		res.status(500)
	} finally {
		res.end()
	}
}

export default ChangeHandler