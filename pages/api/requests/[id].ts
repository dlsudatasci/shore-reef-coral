import prisma from '@lib/prisma'
import { Prisma } from '@prisma/client'
import { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react'

const selectLeader = Prisma.validator<Prisma.Team$UsersOnTeamArgs>()({
	select: {
		userId: true
	},
	where: {
		isLeader: true
	}
})

const userteams = Prisma.validator<Prisma.TeamArgs>()({
	select: {
		id: true,
		name: true,
		UsersOnTeam: selectLeader
	}
})

export type UserTeamsAPI = Prisma.TeamGetPayload<typeof userteams>

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
	const { method } = req
	const id = Number(req.query.id)

	const session = await getSession({ req })
	if (!session) return res.status(401)

	try {
		switch (method) {
			case 'PATCH': {
				const status = req.body.status as string | undefined

				if (status != 'approved' && status != 'rejected') return res.status(400).send('Invalid status')

				const request = await prisma.usersOnTeams.findUnique({ where: { id } })

				if (!request) return res.status(400).send('Request not found')
				if (request.status != 'pending') return res.status(400).send('Cannot set non-pending request')

				// check if logged-in user is the leader of the requester's team
				const count = await prisma.usersOnTeams.count({
					where: {
						userId: session.user.id,
						teamId: request.teamId,
						isLeader: true
					}
				})

				if (!count) return res.status(401)

				await prisma.usersOnTeams.update({
					data: { status },
					where: { id }
				})
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

export default handler