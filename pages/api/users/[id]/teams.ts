import prisma from '@lib/prisma'
import { NextApiRequest, NextApiResponse } from 'next'


const handler = async (req: NextApiRequest, res: NextApiResponse) => {
	const { body, method, query } = req
	const id = parseInt(query.id as string)

	try {
		switch (method) {
			case 'GET': {
				const teams = await prisma.user.findFirst({
					select: { UsersOnTeam: true },
					where: { id }
				})

				res.json(teams?.UsersOnTeam)
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