import prisma from '@lib/prisma'
import { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '../auth/[...nextauth]'


const handler = async (req: NextApiRequest, res: NextApiResponse) => {
	const { method } = req

	const session = await getServerSession(req, res, authOptions)
	if (!session) return res.status(401)

	try {
		switch (method) {
			case 'GET': {
				const data = await prisma.managementType.findMany()
				res.json(data)
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