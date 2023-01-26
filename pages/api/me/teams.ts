import prisma from '@lib/prisma'
import { Prisma } from '@prisma/client'
import { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react'

const userteams = Prisma.validator<Prisma.TeamArgs>()({
	select: {
		id: true,
		name: true
	}
})

export type UserTeamsAPI = Prisma.TeamGetPayload<typeof userteams>

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
	const { method } = req

	const session = await getSession({ req })
	if (!session) return res.status(401)

	try {
		switch (method) {
			case 'GET': {
				const teams = await prisma.team.findMany({
					...userteams,
					where: {
						UsersOnTeam: {
							some: {
								userId: session.user.id,
								status: 'approved'
							}
						}
					}
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