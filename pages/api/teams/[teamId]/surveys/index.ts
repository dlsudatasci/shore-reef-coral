import { NextApiRequest, NextApiResponse } from 'next'
import { Prisma } from '@prisma/client'
import { getSession } from 'next-auth/react'
import prisma from '@lib/prisma'

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
				const session = await getSession({ req })
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
