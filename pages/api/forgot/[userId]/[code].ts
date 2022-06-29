import { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient } from '@prisma/client'
import { hashPassword } from '../../../../lib/password-util'

const prisma = new PrismaClient()

const ForgotHandler = async (req: NextApiRequest, res: NextApiResponse) => {
	const { body, method } = req
	const { userId, code } = req.query
	const where = { userId: parseInt(userId as string), code: code as string }

	try {
		switch (method) {
			case 'GET': {
				const isValid = (await prisma.passwordRecovery.findFirst({ where })) != null
				res.send(isValid)
				break
			}

			case 'PATCH': {
				// perform checks before consuming link
				if (body.password != body.confirmPassword) {
					return res.json({ confirmPassword: 'passwords do not match' })
				}

				const { count } = await prisma.passwordRecovery.deleteMany({ where })

				if (!count) {
					return res.status(401).send('Reset link is invalid')
				}

				await prisma.user.update({
					data: { ...hashPassword(body.password) },
					where: { id: where.userId }
				})
				res.json({})
				break
			}

			default:
				res.setHeader('Allow', ['GET', 'PATCH'])
				res.status(405).end(`Method ${method} Not Allowed`)
		}
	} catch (err) {
		console.error(err)
		res.status(500)
	} finally {
		res.end()
	}
}

export default ForgotHandler
