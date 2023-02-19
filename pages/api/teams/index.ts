import { NextApiRequest, NextApiResponse } from 'next'
import { Prisma, Team } from '@prisma/client'
import { getSession } from 'next-auth/react'
import prisma from '@lib/prisma'
import { TeamCreateSchema } from '@pages/teams/create'
import locations from '@public/bgy-masterlist.json'

export type TeamProfileSummary = Prisma.TeamGetPayload<typeof selectTeamProfile>

const selectLeaderName = Prisma.validator<Prisma.Team$UsersOnTeamArgs>()({
	select: {
		user: {
			select: { firstName: true, lastName: true, }
		},
	},
	where: { isLeader: true }
})

const selectTeamProfile = Prisma.validator<Prisma.TeamArgs>()({
	select: {
		id: true,
		town: true,
		name: true,
		province: true,
		isVerified: true,
		_count: {
			select: { UsersOnTeam: true }
		},
		UsersOnTeam: selectLeaderName
	}
})

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
	const { method } = req
	const body = req.body as Team

	try {
		switch (method) {
			case 'GET': {
				const query = req.query as { filter?: string }

				const session = await getSession({ req })
				if (!session) return res.status(401)

				if (query.filter == 'joinable') {
					const teams = await prisma.team.findMany({
						...selectTeamProfile,
						where: {
							UsersOnTeam: {
								none: { userId: session.user.id }
							}
						}
					})
					return res.json(teams)
				}

				const teams = await prisma.team.findMany({ ...selectTeamProfile })
				res.json(teams)
				break
			}

			case 'POST': {
				const session = await getSession({ req })
				if (!session) return res.status(401)

				// validate location
				const barangayList = (locations[2] as unknown as Record<string, string[]>)[body.province + body.town]

				if (!barangayList.includes(body.barangay)) {
					return res.status(400).json({
						barangay: 'Invalid location'
					} as Partial<TeamCreateSchema>)
				}

				try {
					const { id } = await prisma.team.create({ data: body })
					await prisma.usersOnTeams.create({
						data: {
							teamId: id,
							userId: session.user.id,
							isLeader: true,
							status: 'approved'
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
