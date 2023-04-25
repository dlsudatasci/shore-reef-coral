import { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react'
import prisma from '@lib/prisma'
import { Prisma, Status } from '@prisma/client'

const selectMembers = Prisma.validator<Prisma.Team$UsersOnTeamArgs>()({
	select: {
		id: true,
		user: {
			select: {
				id: true,
				firstName: true,
				lastName: true,
				affiliation: true,
			}
		},
		status: true,
	},
	where: {
		OR: [{ status: 'ACCEPTED' }, { status: 'PENDING' }]
	}
})

const selectRequests = Prisma.validator<Prisma.TeamArgs>()({
	select: {
		name: true,
		UsersOnTeam: selectMembers
	}
})

export type MemberAPI = Prisma.TeamGetPayload<typeof selectRequests>

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

				const requests = await prisma.team.findUnique({
					...selectRequests,
					where: { id: teamId, }
				})

				res.json(requests)
				break
			}

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
				res.setHeader('Allow', ['GET', 'POST'])
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
