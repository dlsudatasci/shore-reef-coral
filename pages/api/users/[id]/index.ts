import { PrismaClient } from '@prisma/client'
import { NextApiRequest, NextApiResponse } from 'next'
import { getToken } from 'next-auth/jwt'

const prisma = new PrismaClient()

const ChangeHandler = async (req: NextApiRequest, res: NextApiResponse) => {
	const { body, method, query } = req

	try {
		switch (method) {
			case 'GET': {
				let id: number

				if (query.id == 'me') {
					const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })
					
					if (!token) return res.status(401)
					
					id = token.id
				} else {
					id = parseInt(query.id as string)
				}

				const user = await prisma.user.findFirst({
					select: { firstName: true, lastName: true, affiliation: true, contactNumber: true },
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