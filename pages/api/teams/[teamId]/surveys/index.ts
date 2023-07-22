import { NextApiRequest, NextApiResponse } from 'next'
import { Prisma } from '@prisma/client'
import { getServerSession } from 'next-auth/next'
import prisma from '@lib/prisma'
import { authOptions } from '@pages/api/auth/[...nextauth]'

export type TeamSurveySummary = Prisma.SurveyGetPayload<typeof teamSurveys>

const teamSurveys = Prisma.validator<Prisma.SurveyArgs>()({
	select: {
		id: true,
		date: true,
		stationName: true,
		startLongtitude: true,
		startLatitude: true,
		dataType: true,
		status: true,
		verified: true
	}
})

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
	const { method } = req
	const teamId = Number(req.query.teamId)

	try {
		switch (method) {
			case 'GET': {
				const teams = await prisma.survey.findMany({
					where: { teamId },
					...teamSurveys,
				})

				res.json(teams)
				break
			}

			case 'POST': {
				const session = await getServerSession(req, res, authOptions)
				if (!session) return res.status(401)

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
