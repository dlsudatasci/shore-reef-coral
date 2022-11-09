import { NextApiRequest, NextApiResponse } from 'next'
import { sendPasswordReset } from '../../../lib/send-email'
import { randomBytes } from 'crypto'
import prisma from '@lib/prisma'

const ForgotHandler = async (req: NextApiRequest, res: NextApiResponse) => {
	const { body, method } = req

	try {
		switch (method) {
			case 'POST': {
				const user = await prisma.user.findFirst({ where: { email: body.email }})
				
				if (user) {
					const code = randomBytes(16).toString('hex')
					await prisma.passwordRecovery.upsert({
						where: { userId: user.id },
						update: { code },
						create: { userId: user.id, code }
					})
					await sendPasswordReset(user.email, `${process.env.NEXTAUTH_URL}/forgot/${user.id}/${code}`)
					res.send(true)
				} else {
					res.send(false)
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

export default ForgotHandler
