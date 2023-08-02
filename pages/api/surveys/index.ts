import { NextApiRequest, NextApiResponse } from 'next'
import { Prisma, Status, Team } from '@prisma/client'
import { getServerSession } from 'next-auth/next'
import prisma from '@lib/prisma'
import locations from '@public/bgy-masterlist.json'
import { authOptions } from '../auth/[...nextauth]'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
	const { method } = req
	const body = req.body as Team

	try {
		switch (method) {
			case 'POST': {
				const session = await getServerSession(req, res, authOptions)
				if (!session) return res.status(401)

				const data = await (await fetch('http://ccscloud2.dlsu.edu.ph:22302/app/extract')).json()
				
				console.log(data)

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
