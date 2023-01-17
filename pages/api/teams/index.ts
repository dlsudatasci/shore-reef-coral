import { NextApiRequest, NextApiResponse } from 'next'
import { Prisma, Team, User } from '@prisma/client'
import { getSession } from 'next-auth/react'
import prisma from '@lib/prisma'
import { TeamCreateSchema } from '@pages/teams/create'

export type TeamProfileSummary = Prisma.UsersOnTeamsGetPayload<typeof teamProfile>

const teamProfile = Prisma.validator<Prisma.UsersOnTeamsArgs>()({
	select: {
		user: {
			select: {
				firstName: true,
				lastName: true,
			}
		},
		team: {
			select: {
				id: true,
				town: true,
				name: true,
				province: true,
				isVerified: true,
				_count: {
					select: { UsersOnTeam: true }
				}
			}
		},
	}
})

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
	const { method } = req
	const body = req.body as Team

	try {
		switch (method) {
			case 'GET': {
				const teams = await prisma.usersOnTeams.findMany({
					where: { isLeader: true },
					...teamProfile,
				})
				res.json(teams)
				break
			}

			case 'POST': {
				const session = await getSession({ req })
				if (!session)	return res.status(401)

				try {
					const { id } = await prisma.team.create({ data: body })
					await prisma.usersOnTeams.create({
						data: {
							teamId: id,
							userId: session.user.id,
							isLeader: true,
						}
					})
				} catch (e) {
					if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2002') {
						return res.status(400).json({
							name: 'Team name already taken!',
						} as Partial<TeamCreateSchema>)
					}

					throw e
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

export default handler
