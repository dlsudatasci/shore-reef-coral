import { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react'
import prisma from '@lib/prisma'
import { Prisma } from '@prisma/client'

const selectRequests = Prisma.validator<Prisma.UsersOnTeamsArgs>()({
	select: {
		id: true,
		user: {
			select: {
				firstName: true,
				lastName: true,
				affiliation: true,
			}
		}
	}
})

export type RequestsAPI = Prisma.UsersOnTeamsGetPayload<typeof selectRequests>

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
	const { method } = req
	const teamId = Number(req.query.teamId)

	try {
		switch (method) {
			case 'GET': {
				const session = await getSession({ req })
				if (!session) return res.status(401)

				// Authenticate team leader
				const count = await prisma.usersOnTeams.count({
					where: {
						userId: session.user.id,
						isLeader: true
					}
				})

				if (!count) return res.status(401)

				const requests = await prisma.usersOnTeams.findMany({
					...selectRequests,
					where: {
						status: 'pending',
						teamId,
					}
				})

				res.json(requests)
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

export default handler
