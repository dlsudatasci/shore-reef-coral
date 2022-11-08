import { NextApiRequest, NextApiResponse } from 'next'
import prisma from '@lib/prisma'
import { hashPassword } from '@lib/password-util'

const usersHandler = async (req: NextApiRequest, res: NextApiResponse) => {
	const { body, method } = req
	
	try {
		switch (method) {
			case 'POST': {
				const noMatch = (await prisma.user.findFirst({ where: { email: body.email }})) == null

				if (noMatch) {
					await prisma.user.create({
						data: {
							...body,
							...hashPassword(body.password)
						}
					})
				} else {
					res.json({ email: 'Email is already taken!' })
				}
				break
			}

			default:
				res.setHeader('Allow', ['POST'])
				res.status(405).end(`Method ${method} Not Allowed`)
		}
	} catch (err) {
		console.error(err)
		res.status(500)
	} finally {
		res.end()
	}
}

export default usersHandler
