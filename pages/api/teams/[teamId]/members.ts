import { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react'
import prisma from '@lib/prisma'
import { Status } from '@prisma/client'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
	const { method } = req
	const teamId = Number(req.query.teamId)

	try {
		switch (method) {
			case 'POST': {
				const session = await getSession({ req })
				if (!session) return res.status(401)

				const count = await prisma.usersOnTeams.count({
					where: {
						teamId,
						userId: session.user.id,
						status: Status.PENDING,
					}
				})

				if (count !== 0) {
					return res.status(400).json({ message: 'You already have a pending request to this team!' })
				}

				await prisma.usersOnTeams.create({
					data: {
						teamId,
						userId: session.user.id,
					}
				})

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

export default handler
