import { NextApiRequest, NextApiResponse } from 'next'
import { Prisma, PrismaClient, Team, User } from '@prisma/client'
import { getSession } from 'next-auth/react'

const prisma = new PrismaClient()

export type TeamProfileSummary = {
	user: Pick<User, 'firstName' | 'lastName'>
	team: Pick<Team, 'id' | 'name' | 'town' | 'province' | 'isVerified'> & {
		_count: {
			UsersOnTeam: number
		}
	}
}

const handler = async (req: NextApiRequest, res: NextApiResponse<TeamProfileSummary[]>) => {
	const { method } = req
	const body = req.body as Team

	try {
		switch (method) {
			case 'GET': {
				const teams = await prisma.usersOnTeams.findMany({
					where: { isLeader: true },
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

				res.json(teams)
				break
			}

			case 'POST': {
				const session = await getSession({ req })

				if (!session) return

				const { id } = await prisma.team.create({ data: body })
				await prisma.usersOnTeams.create({
					data: {
						teamId: id,
						userId: session.user.id,
						isLeader: true,
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
