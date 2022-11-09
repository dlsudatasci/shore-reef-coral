import { NextApiRequest, NextApiResponse } from 'next'
import { getToken } from "next-auth/jwt"
import { hashPassword, matchPassword } from '@lib/password-util'
import prisma from '@lib/prisma'

const ChangeHandler = async (req: NextApiRequest, res: NextApiResponse) => {
	const { body, method } = req
	const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })

	if (!token) return res.status(401).end()

	try {
		switch (method) {
			case 'PATCH': { // change password
				const user = await prisma.user.findFirst({
					select: { password: true, salt: true },
					where: { id: token.id }
				})

				if (!user) throw Error('User does not exist!')

				if (body.oldPassword == body.newPassword) {
					return res.json({ newPassword: 'new password must be different from old password' })
				}

				if (!matchPassword(body.oldPassword, user.password, user.salt)) {
					return res.json({ oldPassword: 'wrong password' })
				}

				if (body.newPassword != body.confirmPassword) {
					return res.json({ confirmPassword: 'passwords do not match' })
				}

				await prisma.user.update({
					data: { password: hashPassword(body.newPassword, user.salt).password },
					where: { id: token.id }
				})

				res.json({})
				break
			}

			default:
				res.setHeader('Allow', ['PATCH'])
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
