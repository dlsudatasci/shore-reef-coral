import prisma from '@lib/prisma'
import { Prisma } from '@prisma/client'
import { NextApiRequest, NextApiResponse } from 'next'

const userteams = Prisma.validator<Prisma.UsersOnTeamsArgs>()({
	select: {
		teamId: true,
		isLeader: true,
		status: true,
		team: {
			select: {
				name: true
			}
		}
	}
})

export type UserTeamsAPI = Prisma.UsersOnTeamsGetPayload<typeof userteams>

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
	const { method, query } = req
	const id = parseInt(query.id as string)

	try {
		switch (method) {
			case 'GET': {
				const teams = await prisma.usersOnTeams.findMany({
					...userteams,
					where: { userId: id }
				})

				res.json(teams)
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